import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async overview(orgId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalVisits, visitsThisMonth, totalDoctors, distributionsThisMonth, totalDelegates] =
      await Promise.all([
        this.prisma.visit.count({ where: { organizationId: orgId } }),
        this.prisma.visit.count({ where: { organizationId: orgId, visitedAt: { gte: startOfMonth } } }),
        this.prisma.doctor.count({ where: { organizationId: orgId } }),
        this.prisma.visitDistribution.aggregate({
          where: {
            organizationId: orgId,
            createdAt: { gte: startOfMonth },
            PromotionalItem: { type: { in: ['EMG', 'GADGET'] as any } },
          },
          _sum: { quantity: true },
        }),
        this.prisma.organizationUser.count({
          where: { organizationId: orgId, isActive: true, businessRole: 'DELEGATE' },
        }),
      ]);

    return {
      totalVisits,
      visitsThisMonth,
      totalDoctors,
      distributionsThisMonth: distributionsThisMonth._sum.quantity || 0,
      totalDelegates,
    };
  }

  async delegatePerformance(orgId: string) {
    const delegates = await this.prisma.organizationUser.findMany({
      where: { organizationId: orgId, businessRole: 'DELEGATE', isActive: true },
      select: {
        id: true,
        teamId: true,
        fullName: true,
        gamme: true,
        User: { select: { firstName: true, lastName: true } },
        Team_OrganizationUser_teamIdToTeam: { select: { name: true } },
        Visit: { select: { id: true } },
      },
    } as any) as any;

    return delegates.map((d: any) => ({
      id: d.id,
      name: d.fullName || `${d.User.firstName} ${d.User.lastName}`,
      gamme: d.gamme ?? null,
      team: d.Team_OrganizationUser_teamIdToTeam?.name ?? null,
      totalVisits: d.Visit.length,
    }));
  }

  async visitsTrend(orgId: string) {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 6);

    const visits = await this.prisma.visit.findMany({
      where: { organizationId: orgId, visitedAt: { gte: cutoff } },
      select: { visitedAt: true },
    });

    const grouped: Record<string, number> = {};
    visits.forEach((v) => {
      const key = v.visitedAt.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
      grouped[key] = (grouped[key] || 0) + 1;
    });

    return Object.entries(grouped).map(([month, count]) => ({ month, visits: count }));
  }

  async doctorCoverage(orgId: string) {
    const doctors = await this.prisma.doctor.findMany({
      where: { organizationId: orgId },
      select: { id: true, type: true },
    });

    const visitedDoctors = await this.prisma.visit.findMany({
      where: { organizationId: orgId },
      select: { doctorId: true },
      distinct: ['doctorId'],
    });

    const visitedIds = new Set(visitedDoctors.map((v) => v.doctorId));

    const byType: Record<string, { total: number; visited: number }> = {};
    doctors.forEach((d) => {
      if (!byType[d.type]) byType[d.type] = { total: 0, visited: 0 };
      byType[d.type].total++;
      if (visitedIds.has(d.id)) byType[d.type].visited++;
    });

    return Object.entries(byType).map(([type, data]) => ({
      type,
      doctors: data.total,
      visited: data.visited,
      coverage: data.total > 0 ? Math.round((data.visited / data.total) * 100) : 0,
    }));
  }

  async promoDistributionSummary(orgId: string) {
    // Only EMG and GADGET — SAMPLE removed
    const items = await this.prisma.promotionalItem.findMany({
      where: {
        organizationId: orgId,
        type: { in: ['EMG', 'GADGET'] as any },
      },
      include: {
        VisitDistribution: { select: { quantity: true } },
      },
    });

    return items.map((item) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      totalStock: item.totalStock,
      totalDistributed: item.VisitDistribution.reduce((s, d) => s + d.quantity, 0),
    }));
  }
}
