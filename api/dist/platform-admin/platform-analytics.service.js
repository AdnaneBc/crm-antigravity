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
exports.PlatformAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PlatformAnalyticsService = class PlatformAnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async revenueTrend() {
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        const invoices = await this.prisma.invoice.findMany({
            where: { status: 'PAID', paidAt: { gte: twelveMonthsAgo } },
            select: { amount: true, paidAt: true },
        });
        const grouped = {};
        invoices.forEach((inv) => {
            if (!inv.paidAt)
                return;
            const key = `${inv.paidAt.getFullYear()}-${String(inv.paidAt.getMonth() + 1).padStart(2, '0')}`;
            grouped[key] = (grouped[key] || 0) + inv.amount;
        });
        const result = [];
        for (let i = 11; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const label = d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
            result.push({ month: label, revenue: Math.round((grouped[key] || 0) * 100) / 100 });
        }
        return result;
    }
    async orgGrowth() {
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        const orgs = await this.prisma.organization.findMany({
            where: { createdAt: { gte: twelveMonthsAgo } },
            select: { createdAt: true },
        });
        const grouped = {};
        orgs.forEach((o) => {
            const key = `${o.createdAt.getFullYear()}-${String(o.createdAt.getMonth() + 1).padStart(2, '0')}`;
            grouped[key] = (grouped[key] || 0) + 1;
        });
        const result = [];
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
    async userGrowth() {
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        const users = await this.prisma.user.findMany({
            where: { createdAt: { gte: twelveMonthsAgo } },
            select: { createdAt: true },
        });
        const grouped = {};
        users.forEach((u) => {
            const key = `${u.createdAt.getFullYear()}-${String(u.createdAt.getMonth() + 1).padStart(2, '0')}`;
            grouped[key] = (grouped[key] || 0) + 1;
        });
        const beforeCount = await this.prisma.user.count({
            where: { createdAt: { lt: twelveMonthsAgo } },
        });
        const result = [];
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
    async activeOrgsOverTime() {
        const totalActive = await this.prisma.organization.count({ where: { isActive: true } });
        const totalSuspended = await this.prisma.organization.count({ where: { isActive: false } });
        const suspensions = await this.prisma.organization.findMany({
            where: { suspendedAt: { not: null } },
            select: { suspendedAt: true },
        });
        const grouped = {};
        suspensions.forEach((o) => {
            if (!o.suspendedAt)
                return;
            const key = `${o.suspendedAt.getFullYear()}-${String(o.suspendedAt.getMonth() + 1).padStart(2, '0')}`;
            grouped[key] = (grouped[key] || 0) + 1;
        });
        const trend = [];
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
};
exports.PlatformAnalyticsService = PlatformAnalyticsService;
exports.PlatformAnalyticsService = PlatformAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlatformAnalyticsService);
//# sourceMappingURL=platform-analytics.service.js.map