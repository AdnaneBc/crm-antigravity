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
exports.PlatformBillingService = exports.UpdateInvoiceDto = exports.UpdatePlanDto = exports.CreatePlanDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const class_validator_1 = require("class-validator");
class CreatePlanDto {
}
exports.CreatePlanDto = CreatePlanDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "interval", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "maxUsers", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "maxDoctors", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreatePlanDto.prototype, "features", void 0);
class UpdatePlanDto {
}
exports.UpdatePlanDto = UpdatePlanDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePlanDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePlanDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePlanDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePlanDto.prototype, "interval", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePlanDto.prototype, "maxUsers", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePlanDto.prototype, "maxDoctors", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdatePlanDto.prototype, "features", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePlanDto.prototype, "isActive", void 0);
class UpdateInvoiceDto {
}
exports.UpdateInvoiceDto = UpdateInvoiceDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "notes", void 0);
let PlatformBillingService = class PlatformBillingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllPlans() {
        return this.prisma.subscriptionPlan.findMany({
            include: {
                _count: { select: { OrganizationSubscription: true } },
            },
            orderBy: { price: 'asc' },
        });
    }
    async createPlan(dto) {
        return this.prisma.subscriptionPlan.create({
            data: {
                name: dto.name,
                description: dto.description,
                price: dto.price,
                interval: dto.interval || 'MONTHLY',
                maxUsers: dto.maxUsers ?? 50,
                maxDoctors: dto.maxDoctors ?? 500,
                features: dto.features ?? [],
            },
        });
    }
    async updatePlan(id, dto) {
        return this.prisma.subscriptionPlan.update({
            where: { id },
            data: {
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.price !== undefined && { price: dto.price }),
                ...(dto.interval !== undefined && { interval: dto.interval }),
                ...(dto.maxUsers !== undefined && { maxUsers: dto.maxUsers }),
                ...(dto.maxDoctors !== undefined && { maxDoctors: dto.maxDoctors }),
                ...(dto.features !== undefined && { features: dto.features }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
            },
        });
    }
    async findAllSubscriptions(status) {
        const where = {};
        if (status)
            where.status = status;
        return this.prisma.organizationSubscription.findMany({
            where,
            include: {
                Organization: { select: { id: true, name: true, isActive: true } },
                Plan: { select: { id: true, name: true, price: true, interval: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findAllInvoices(status, organizationId) {
        const where = {};
        if (status)
            where.status = status;
        if (organizationId)
            where.organizationId = organizationId;
        return this.prisma.invoice.findMany({
            where,
            include: {
                Organization: { select: { id: true, name: true } },
                Subscription: {
                    select: {
                        Plan: { select: { name: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateInvoice(id, dto) {
        const data = {};
        if (dto.status) {
            data.status = dto.status;
            if (dto.status === 'PAID')
                data.paidAt = new Date();
        }
        if (dto.notes !== undefined)
            data.notes = dto.notes;
        return this.prisma.invoice.update({
            where: { id },
            data,
            include: {
                Organization: { select: { id: true, name: true } },
            },
        });
    }
    async revenueAnalytics() {
        const byOrg = await this.prisma.invoice.groupBy({
            by: ['organizationId'],
            where: { status: 'PAID' },
            _sum: { amount: true },
            _count: { id: true },
        });
        const orgIds = byOrg.map((r) => r.organizationId);
        const orgs = await this.prisma.organization.findMany({
            where: { id: { in: orgIds } },
            select: { id: true, name: true },
        });
        const orgMap = new Map(orgs.map((o) => [o.id, o.name]));
        return byOrg.map((r) => ({
            organizationId: r.organizationId,
            organizationName: orgMap.get(r.organizationId) || 'Unknown',
            totalRevenue: r._sum.amount || 0,
            invoiceCount: r._count.id,
        }));
    }
};
exports.PlatformBillingService = PlatformBillingService;
exports.PlatformBillingService = PlatformBillingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlatformBillingService);
//# sourceMappingURL=platform-billing.service.js.map