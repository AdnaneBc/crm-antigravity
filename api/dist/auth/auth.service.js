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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                OrganizationUser: {
                    where: { isActive: true },
                    include: {
                        Organization: true,
                    },
                },
            },
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Identifiants invalides');
        }
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            throw new common_1.UnauthorizedException('Identifiants invalides');
        }
        const orgUsers = user.OrganizationUser || [];
        const orgUser = orgUsers[0];
        const payload = {
            sub: user.id,
            email: user.email,
            platformRole: user.platformRole,
            orgUserId: orgUser?.id,
            organizationId: orgUser?.organizationId,
            organizationRole: orgUser?.organizationRole,
            businessRole: orgUser?.businessRole,
        };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '8h' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                platformRole: user.platformRole,
                orgUserId: orgUser?.id,
                organizationId: orgUser?.organizationId,
                organizationRole: orgUser?.organizationRole,
                businessRole: orgUser?.businessRole,
                teamId: orgUser?.teamId,
                organization: orgUser?.Organization
                    ? { id: orgUser.Organization.id, name: orgUser.Organization.name }
                    : null,
            },
        };
    }
    async refresh(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const { iat, exp, ...rest } = payload;
            const accessToken = this.jwtService.sign(rest, { expiresIn: '8h' });
            return { accessToken };
        }
        catch {
            throw new common_1.UnauthorizedException('Refresh token invalide ou expiré');
        }
    }
    async getProfile(userId) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                platformRole: true,
                phone: true,
                address: true,
                profileImageUrl: true,
                createdAt: true,
                OrganizationUser: {
                    where: { isActive: true },
                    select: {
                        id: true,
                        organizationId: true,
                        organizationRole: true,
                        businessRole: true,
                        teamId: true,
                        managerId: true,
                        Organization: { select: { id: true, name: true, logoUrl: true, primaryColor: true } },
                        Team_OrganizationUser_teamIdToTeam: { select: { id: true, name: true } },
                    },
                },
            },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map