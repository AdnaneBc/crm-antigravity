import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlatformDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalOrganizations,
      activeOrganizations,
      suspendedOrganizations,
      totalUsers,
      activeUsers,
      totalInvoices,
      pendingInvoices,
      overdueInvoices,
      paidInvoicesTotal,
      paidInvoicesThisMonth,
      subscriptionStatuses,
      totalDoctors,
      totalVisits,
    ] = await Promise.all([
      // Organizations
      this.prisma.organization.count(),
      this.prisma.organization.count({ where: { isActive: true } }),
      this.prisma.organization.count({ where: { isActive: false } }),

      // Users
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),

      // Invoices
      this.prisma.invoice.count(),
      this.prisma.invoice.count({ where: { status: 'PENDING' } }),
      this.prisma.invoice.count({ where: { status: 'OVERDUE' } }),

      // Revenue: total paid
      this.prisma.invoice.aggregate({
        where: { status: 'PAID' },
        _sum: { amount: true },
      }),

      // Revenue: this month
      this.prisma.invoice.aggregate({
        where: { status: 'PAID', paidAt: { gte: startOfMonth } },
        _sum: { amount: true },
      }),

      // Subscription breakdown
      this.prisma.organizationSubscription.groupBy({
        by: ['status'],
        _count: { id: true },
      }),

      // Platform usage stats (aggregate counts only, no medical data)
      this.prisma.doctor.count(),
      this.prisma.visit.count(),
    ]);

    const subscriptions: Record<string, number> = {};
    subscriptionStatuses.forEach((s: any) => {
      subscriptions[s.status] = s._count.id;
    });

    return {
      organizations: {
        total: totalOrganizations,
        active: activeOrganizations,
        suspended: suspendedOrganizations,
      },
      users: {
        total: totalUsers,
        active: activeUsers,
      },
      revenue: {
        total: paidInvoicesTotal._sum.amount || 0,
        monthly: paidInvoicesThisMonth._sum.amount || 0,
        currency: 'EUR',
      },
      invoices: {
        total: totalInvoices,
        pending: pendingInvoices,
        overdue: overdueInvoices,
      },
      subscriptions: {
        active: subscriptions['ACTIVE'] || 0,
        trial: subscriptions['TRIAL'] || 0,
        suspended: subscriptions['SUSPENDED'] || 0,
        cancelled: subscriptions['CANCELLED'] || 0,
      },
      platformUsage: {
        totalDoctors,
        totalVisits,
      },
    };
  }
}
