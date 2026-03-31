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
exports.UsersService = exports.CreateOrgUserDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcryptjs");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateOrgUserDto {
}
exports.CreateOrgUserDto = CreateOrgUserDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateOrgUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrgUserDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrgUserDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrgUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.BusinessRole),
    __metadata("design:type", String)
], CreateOrgUserDto.prototype, "businessRole", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.OrganizationRole),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOrgUserDto.prototype, "organizationRole", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrgUserDto.prototype, "teamId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrgUserDto.prototype, "managerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrgUserDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrgUserDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrgUserDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrgUserDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrgUserDto.prototype, "gamme", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateOrgUserDto.prototype, "assignedSectors", void 0);
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(orgId, orgUserId, businessRole) {
        const baseInclude = {
            User: { select: { id: true, firstName: true, lastName: true, email: true, profileImageUrl: true, phone: true } },
            Team_OrganizationUser_teamIdToTeam: { select: { id: true, name: true } },
            OrganizationUser: { select: { id: true, User: { select: { firstName: true, lastName: true } } } },
        };
        if (businessRole === 'DELEGATE' && orgUserId) {
            return this.prisma.organizationUser.findMany({
                where: { organizationId: orgId, isActive: true, id: orgUserId },
                include: baseInclude,
                orderBy: { createdAt: 'asc' },
            });
        }
        if (businessRole === 'DSM' && orgUserId) {
            return this.prisma.organizationUser.findMany({
                where: {
                    organizationId: orgId,
                    isActive: true,
                    OR: [
                        { id: orgUserId },
                        { managerId: orgUserId },
                    ],
                },
                include: baseInclude,
                orderBy: { createdAt: 'asc' },
            });
        }
        return this.prisma.organizationUser.findMany({
            where: { organizationId: orgId, isActive: true },
            include: baseInclude,
            orderBy: { createdAt: 'asc' },
        });
    }
    async findOne(id) {
        return this.prisma.organizationUser.findUnique({
            where: { id },
            include: {
                User: true,
                Team_OrganizationUser_teamIdToTeam: true,
                OrganizationUser: { include: { User: { select: { firstName: true, lastName: true } } } },
                other_OrganizationUser: { include: { User: { select: { firstName: true, lastName: true } } } },
                Visit: { orderBy: { visitedAt: 'desc' }, take: 10, include: { doctor: true } },
            },
        });
    }
    async create(dto, orgId) {
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.upsert({
            where: { email: dto.email },
            update: {},
            create: {
                email: dto.email,
                firstName: dto.firstName,
                lastName: dto.lastName,
                passwordHash,
                phone: dto.phone,
                updatedAt: new Date(),
            },
        });
        const orgUserId = `${user.id}-${orgId}`.replace(/-/g, '').substring(0, 25);
        return this.prisma.organizationUser.create({
            data: {
                id: orgUserId,
                userId: user.id,
                organizationId: orgId,
                businessRole: dto.businessRole,
                organizationRole: dto.organizationRole || 'MEMBER',
                teamId: dto.teamId,
                managerId: dto.managerId,
                fullName: dto.fullName,
                gender: dto.gender,
                phone: dto.phone,
                city: dto.city,
                gamme: dto.gamme,
                assignedSectors: dto.assignedSectors ?? [],
                updatedAt: new Date(),
            },
            include: { User: { select: { id: true, firstName: true, lastName: true, email: true } } },
        });
    }
    async update(id, dto) {
        return this.prisma.organizationUser.update({
            where: { id },
            data: {
                businessRole: dto.businessRole,
                organizationRole: dto.organizationRole,
                teamId: dto.teamId,
                managerId: dto.managerId,
                fullName: dto.fullName,
                gender: dto.gender,
                phone: dto.phone,
                city: dto.city,
                gamme: dto.gamme,
                assignedSectors: dto.assignedSectors,
                updatedAt: new Date(),
            },
        });
    }
    async deactivate(id) {
        return this.prisma.organizationUser.update({
            where: { id },
            data: { isActive: false, updatedAt: new Date() },
        });
    }
    async getTeams(orgId, orgUserId, businessRole) {
        const teamInclude = {
            OrganizationUser_OrganizationUser_teamIdToTeam: {
                where: { isActive: true },
                include: {
                    User: { select: { firstName: true, lastName: true, email: true, phone: true } },
                    Sector: { select: { id: true, name: true } },
                },
            },
            OrganizationUser_Team_managerIdToOrganizationUser: {
                include: { User: { select: { firstName: true, lastName: true } } },
            },
        };
        if (businessRole === 'DSM' && orgUserId) {
            return this.prisma.team.findMany({
                where: { organizationId: orgId, managerId: orgUserId },
                include: teamInclude,
            });
        }
        if (businessRole === 'DELEGATE' && orgUserId) {
            const delegate = await this.prisma.organizationUser.findUnique({
                where: { id: orgUserId },
                select: { teamId: true },
            });
            if (!delegate?.teamId)
                return [];
            return this.prisma.team.findMany({
                where: { organizationId: orgId, id: delegate.teamId },
                include: teamInclude,
            });
        }
        return this.prisma.team.findMany({
            where: { organizationId: orgId },
            include: teamInclude,
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map