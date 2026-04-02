"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformDashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PlatformDashboardService = class PlatformDashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const [totalOrganizations, activeOrganizations, suspendedOrganizations, totalUsers, activeUsers, totalInvoices, pendingInvoices, overdueInvoices, paidInvoicesTotal, paidInvoicesThisMonth, subscriptionStatuses, totalDoctors, totalVisits,] = await Promise.all([
            this.prisma.organization.count(),
            this.prisma.organization.count({ where: { isActive: true } }),
            this.prisma.organization.count({ where: { isActive: false } }),
            this.prisma.user.count(),
            this.prisma.user.count({ where: { isActive: true } }),
            this.prisma.invoice.count(),
            this.prisma.invoice.count({ where: { status: 'PENDING' } }),
            this.prisma.invoice.count({ where: { status: 'OVERDUE' } }),
            this.prisma.invoice.aggregate({
                where: { status: 'PAID' },
                _sum: { amount: true },
            }),
            this.prisma.invoice.aggregate({
                where: { status: 'PAID', paidAt: { gte: startOfMonth } },
                _sum: { amount: true },
            }),
            this.prisma.organizationSubscription.groupBy({
                by: ['status'],
                _count: { id: true },
            }),
            this.prisma.doctor.count(),
            this.prisma.visit.count(),
        ]);
        const subscriptions = {};
        subscriptionStatuses.forEach((s) => {
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
};
exports.PlatformDashboardService = PlatformDashboardService;
exports.PlatformDashboardService = PlatformDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlatformDashboardService);
//# sourceMappingURL=platform-dashboard.service.js.map