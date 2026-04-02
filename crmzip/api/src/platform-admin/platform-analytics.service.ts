import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlatformAnalyticsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Monthly revenue for the last 12 months
   */
  async revenueTrend() {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const invoices = await this.prisma.invoice.findMany({
      where: { status: 'PAID', paidAt: { gte: twelveMonthsAgo } },
      select: { amount: true, paidAt: true },
    });

    const grouped: Record<string, number> = {};
    invoices.forEach((inv) => {
      if (!inv.paidAt) return;
      const key = `${inv.paidAt.getFullYear()}-${String(inv.paidAt.getMonth() + 1).padStart(2, '0')}`;
      grouped[key] = (grouped[key] || 0) + inv.amount;
    });

    // Fill in missing months
    const result: { month: string; revenue: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
      result.push({ month: label, revenue: Math.round((grouped[key] || 0) * 100) / 100 });
    }

    return result;
  }

  /**
   * Organizations created per month (last 12 months)
   */
  async orgGrowth() {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const orgs = await this.prisma.organization.findMany({
      where: { createdAt: { gte: twelveMonthsAgo } },
      select: { createdAt: true },
    });

    const grouped: Record<string, number> = {};
    orgs.forEach((o) => {
      const key = `${o.createdAt.getFullYear()}-${String(o.createdAt.getMonth() + 1).padStart(2, '0')}`;
      grouped[key] = (grouped[key] || 0) + 1;
    });

    const result: { month: string; newOrganizations: number; cumulative: number }[] = [];
    // Get total org count before the period for cumulative
    const beforeCount = await this.prisma.organization.count({
      where: { createdAt: { lt: twelveMonthsAgo } },
    });

    let cumulative = beforeCount;
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
      const newOrgs = grouped[key] || 0;
      cumulative += newOrgs;
      result.push({ month: label, newOrganizations: newOrgs, cumulative });
    }

    return result;
  }

  /**
   * Users created per month (last 12 months)
   */
  async userGrowth() {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const users = await this.prisma.user.findMany({
      where: { createdAt: { gte: twelveMonthsAgo } },
      select: { createdAt: true },
    });

    const grouped: Record<string, number> = {};
    users.forEach((u) => {
      const key = `${u.createdAt.getFullYear()}-${String(u.createdAt.getMonth() + 1).padStart(2, '0')}`;
      grouped[key] = (grouped[key] || 0) + 1;
    });

    const beforeCount = await this.prisma.user.count({
      where: { createdAt: { lt: twelveMonthsAgo } },
    });

    const result: { month: string; newUsers: number; cumulative: number }[] = [];
    let cumulative = beforeCount;
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
      const newUsers = grouped[key] || 0;
      cumulative += newUsers;
      result.push({ month: label, newUsers, cumulative });
    }

    return result;
  }

  /**
   * Active vs suspended organizations over time (last 12 months snapshot)
   */
  async activeOrgsOverTime() {
    const totalActive = await this.prisma.organization.count({ where: { isActive: true } });
    const totalSuspended = await this.prisma.organization.count({ where: { isActive: false } });

    // Also provide suspension events over time
    const suspensions = await this.prisma.organization.findMany({
      where: { suspendedAt: { not: null } },
      select: { suspendedAt: true },
    });

    const grouped: Record<string, number> = {};
    suspensions.forEach((o) => {
      if (!o.suspendedAt) return;
      const key = `${o.suspendedAt.getFullYear()}-${String(o.suspendedAt.getMonth() + 1).padStart(2, '0')}`;
      grouped[key] = (grouped[key] || 0) + 1;
    });

    const trend: { month: string; suspensions: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
      trend.push({ month: label, suspensions: grouped[key] || 0 });
    }

    return {
      current: { active: totalActive, suspended: totalSuspended },
      trend,
    };
  }
}
