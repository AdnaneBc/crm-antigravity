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
exports.PlatformUsersService = exports.ResetPasswordDto = exports.AssignOrganizationDto = exports.UpdatePlatformUserDto = exports.CreatePlatformUserDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const class_validator_1 = require("class-validator");
const bcrypt = require("bcryptjs");
class CreatePlatformUserDto {
}
exports.CreatePlatformUserDto = CreatePlatformUserDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreatePlatformUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlatformUserDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlatformUserDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlatformUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlatformUserDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlatformUserDto.prototype, "platformRole", void 0);
class UpdatePlatformUserDto {
}
exports.UpdatePlatformUserDto = UpdatePlatformUserDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePlatformUserDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePlatformUserDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePlatformUserDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePlatformUserDto.prototype, "platformRole", void 0);
class AssignOrganizationDto {
}
exports.AssignOrganizationDto = AssignOrganizationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignOrganizationDto.prototype, "organizationId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignOrganizationDto.prototype, "organizationRole", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignOrganizationDto.prototype, "businessRole", void 0);
class ResetPasswordDto {
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "newPassword", void 0);
let PlatformUsersService = class PlatformUsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(search) {
        const where = {};
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                platformRole: true,
                isActive: true,
                phone: true,
                createdAt: true,
                OrganizationUser: {
                    select: {
                        id: true,
                        organizationId: true,
                        organizationRole: true,
                        businessRole: true,
                        isActive: true,
                        Organization: { select: { id: true, name: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                platformRole: true,
                isActive: true,
                phone: true,
                address: true,
                profileImageUrl: true,
                createdAt: true,
                updatedAt: true,
                OrganizationUser: {
                    select: {
                        id: true,
                        organizationId: true,
                        organizationRole: true,
                        businessRole: true,
                        isActive: true,
                        fullName: true,
                        createdAt: true,
                        Organization: { select: { id: true, name: true, isActive: true } },
                    },
                },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async create(dto) {
        const passwordHash = await bcrypt.hash(dto.password, 12);
        return this.prisma.user.create({
            data: {
                email: dto.email,
                firstName: dto.firstName,
                lastName: dto.lastName,
                passwordHash,
                phone: dto.phone,
                platformRole: dto.platformRole === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : undefined,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                platformRole: true,
                isActive: true,
                createdAt: true,
            },
        });
    }
    async update(id, dto) {
        const data = {};
        if (dto.firstName !== undefined)
            data.firstName = dto.firstName;
        if (dto.lastName !== undefined)
            data.lastName = dto.lastName;
        if (dto.phone !== undefined)
            data.phone = dto.phone;
        if (dto.platformRole !== undefined) {
            data.platformRole = dto.platformRole === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : null;
        }
        return this.prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                platformRole: true,
                isActive: true,
            },
        });
    }
    async deactivate(id) {
        return this.prisma.user.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async resetPassword(id, dto) {
        const passwordHash = await bcrypt.hash(dto.newPassword, 12);
        await this.prisma.user.update({
            where: { id },
            data: { passwordHash },
        });
        return { message: 'Password reset successfully' };
    }
    async assignOrganization(userId, dto) {
        const orgUserId = `${userId}-${dto.organizationId}`.replace(/-/g, '').substring(0, 25);
        return this.prisma.organizationUser.upsert({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId: dto.organizationId,
                },
            },
            update: {
                isActive: true,
                organizationRole: dto.organizationRole || 'MEMBER',
                businessRole: dto.businessRole || undefined,
                updatedAt: new Date(),
            },
            create: {
                id: orgUserId,
                userId,
                organizationId: dto.organizationId,
                organizationRole: dto.organizationRole || 'MEMBER',
                businessRole: dto.businessRole || undefined,
                updatedAt: new Date(),
            },
            include: {
                Organization: { select: { id: true, name: true } },
            },
        });
    }
    async revokeOrganization(userId, orgId) {
        const record = await this.prisma.organizationUser.findUnique({
            where: {
                userId_organizationId: { userId, organizationId: orgId },
            },
        });
        if (!record)
            throw new common_1.NotFoundException('Organization membership not found');
        return this.prisma.organizationUser.update({
            where: { id: record.id },
            data: { isActive: false, updatedAt: new Date() },
        });
    }
};
exports.PlatformUsersService = PlatformUsersService;
exports.PlatformUsersService = PlatformUsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlatformUsersService);
//# sourceMappingURL=platform-users.service.js.map