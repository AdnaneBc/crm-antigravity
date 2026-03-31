import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    // Find the user
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
      throw new UnauthorizedException('Identifiants invalides');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Primary org membership
    const orgUsers: any[] = (user as any).OrganizationUser || [];
    const orgUser = orgUsers[0];

    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
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
        firstName: user.firstName,
        lastName: user.lastName,
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

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const { iat, exp, ...rest } = payload;
      const accessToken = this.jwtService.sign(rest, { expiresIn: '8h' });
      return { accessToken };
    } catch {
      throw new UnauthorizedException('Refresh token invalide ou expiré');
    }
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
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
}
