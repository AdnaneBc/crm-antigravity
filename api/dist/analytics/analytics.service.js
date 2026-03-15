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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async overview(orgId) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const [totalVisits, visitsThisMonth, totalDoctors, distributionsThisMonth, totalDelegates] = await Promise.all([
            this.prisma.visit.count({ where: { organizationId: orgId } }),
            this.prisma.visit.count({ where: { organizationId: orgId, visitedAt: { gte: startOfMonth } } }),
            this.prisma.doctor.count({ where: { organizationId: orgId } }),
            this.prisma.visitDistribution.aggregate({
                where: { organizationId: orgId, createdAt: { gte: startOfMonth } },
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
    async delegatePerformance(orgId) {
        const delegates = await this.prisma.organizationUser.findMany({
            where: { organizationId: orgId, businessRole: 'DELEGATE', isActive: true },
            select: {
                id: true,
                teamId: true,
                User: { select: { name: true } },
                Team_OrganizationUser_teamIdToTeam: { select: { name: true } },
                Visit: { select: { id: true } },
            },
        });
        return delegates.map((d) => ({
            id: d.id,
            name: d.User.name,
            team: d.Team_OrganizationUser_teamIdToTeam?.name ?? null,
            totalVisits: d.Visit.length,
        }));
    }
    async visitsTrend(orgId) {
        const cutoff = new Date();
        cutoff.setMonth(cutoff.getMonth() - 6);
        const visits = await this.prisma.visit.findMany({
            where: { organizationId: orgId, visitedAt: { gte: cutoff } },
            select: { visitedAt: true },
        });
        const grouped = {};
        visits.forEach((v) => {
            const key = v.visitedAt.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
            grouped[key] = (grouped[key] || 0) + 1;
        });
        return Object.entries(grouped).map(([month, count]) => ({ month, visits: count }));
    }
    async doctorCoverage(orgId) {
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
        const byType = {};
        doctors.forEach((d) => {
            if (!byType[d.type])
                byType[d.type] = { total: 0, visited: 0 };
            byType[d.type].total++;
            if (visitedIds.has(d.id))
                byType[d.type].visited++;
        });
        return Object.entries(byType).map(([type, data]) => ({
            type,
            doctors: data.total,
            visited: data.visited,
            coverage: data.total > 0 ? Math.round((data.visited / data.total) * 100) : 0,
        }));
    }
    async promoDistributionSummary(orgId) {
        const items = await this.prisma.promotionalItem.findMany({
            where: { organizationId: orgId },
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
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map