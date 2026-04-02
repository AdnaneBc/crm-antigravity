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
exports.PlatformOrganizationsService = exports.AssignSubscriptionDto = exports.UpdateOrganizationDto = exports.CreateOrganizationDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const class_validator_1 = require("class-validator");
class CreateOrganizationDto {
}
exports.CreateOrganizationDto = CreateOrganizationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "logoUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "primaryColor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "secondaryColor", void 0);
class UpdateOrganizationDto {
}
exports.UpdateOrganizationDto = UpdateOrganizationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrganizationDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrganizationDto.prototype, "logoUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrganizationDto.prototype, "primaryColor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrganizationDto.prototype, "secondaryColor", void 0);
class AssignSubscriptionDto {
}
exports.AssignSubscriptionDto = AssignSubscriptionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignSubscriptionDto.prototype, "planId", void 0);
let PlatformOrganizationsService = class PlatformOrganizationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(search, status) {
        const where = {};
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }
        if (status === 'active')
            where.isActive = true;
        else if (status === 'suspended')
            where.isActive = false;
        return this.prisma.organization.findMany({
            where,
            include: {
                _count: {
                    select: {
                        OrganizationUser: true,
                        doctors: true,
                        visits: true,
                    },
                },
                OrganizationSubscription: {
                    where: { status: { in: ['ACTIVE', 'TRIAL'] } },
                    include: { Plan: { select: { name: true, price: true, interval: true } } },
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const org = await this.prisma.organization.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        OrganizationUser: true,
                        doctors: true,
                        visits: true,
                        Team: true,
                        PromotionalItem: true,
                    },
                },
                OrganizationSubscription: {
                    include: { Plan: true },
                    orderBy: { createdAt: 'desc' },
                },
                Invoice: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });
        if (!org)
            throw new common_1.NotFoundException('Organization not found');
        return org;
    }
    async create(dto) {
        return this.prisma.organization.create({
            data: {
                name: dto.name,
                logoUrl: dto.logoUrl,
                primaryColor: dto.primaryColor,
                secondaryColor: dto.secondaryColor,
            },
        });
    }
    async update(id, dto) {
        return this.prisma.organization.update({
            where: { id },
            data: {
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl }),
                ...(dto.primaryColor !== undefined && { primaryColor: dto.primaryColor }),
                ...(dto.secondaryColor !== undefined && { secondaryColor: dto.secondaryColor }),
            },
        });
    }
    async activate(id) {
        return this.prisma.organization.update({
            where: { id },
            data: { isActive: true, suspendedAt: null },
        });
    }
    async suspend(id) {
        return this.prisma.organization.update({
            where: { id },
            data: { isActive: false, suspendedAt: new Date() },
        });
    }
    async assignSubscription(id, dto) {
        await this.prisma.organizationSubscription.updateMany({
            where: { organizationId: id, status: { in: ['ACTIVE', 'TRIAL'] } },
            data: { status: 'CANCELLED', updatedAt: new Date() },
        });
        return this.prisma.organizationSubscription.create({
            data: {
                organizationId: id,
                planId: dto.planId,
                status: 'ACTIVE',
                startDate: new Date(),
            },
            include: { Plan: true },
        });
    }
};
exports.PlatformOrganizationsService = PlatformOrganizationsService;
exports.PlatformOrganizationsService = PlatformOrganizationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlatformOrganizationsService);
//# sourceMappingURL=platform-organizations.service.js.map