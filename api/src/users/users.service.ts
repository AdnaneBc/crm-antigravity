import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { IsString, IsEmail, IsOptional, IsEnum, IsArray } from 'class-validator';
import { BusinessRole, OrganizationRole } from '@prisma/client';

export class CreateOrgUserDto {
  @IsEmail() email: string;
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsString() password: string;
  @IsOptional() @IsEnum(BusinessRole) businessRole?: BusinessRole;
  @IsEnum(OrganizationRole) @IsOptional() organizationRole?: OrganizationRole;
  @IsOptional() @IsString() teamId?: string;
  @IsOptional() @IsString() managerId?: string;
  @IsOptional() @IsString() phone?: string;
  // Extended delegate profile fields
  @IsOptional() @IsString() fullName?: string;
  @IsOptional() @IsString() gender?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() gamme?: string;
  @IsOptional() @IsArray() assignedSectors?: string[];
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * All org members — filtered by role:
   * - DELEGATE → only themselves
   * - DSM → themselves + delegates in their managed teams (grouped by team)
   * - NSM → only DSM + DELEGATE members (no ASSISTANT visibility)
   * - ASSISTANT / ADMIN → all members
   */
  async findAll(orgId: string, orgUserId?: string, businessRole?: string) {
    const baseInclude = {
      User: { select: { id: true, firstName: true, lastName: true, email: true, profileImageUrl: true, phone: true } },
      Team_OrganizationUser_teamIdToTeam: { select: { id: true, name: true } },
      OrganizationUser: { select: { id: true, User: { select: { firstName: true, lastName: true } } } },
    };

    // DELEGATE: only themselves
    if (businessRole === 'DELEGATE' && orgUserId) {
      return this.prisma.organizationUser.findMany({
        where: { organizationId: orgId, isActive: true, id: orgUserId },
        include: baseInclude,
        orderBy: { createdAt: 'asc' },
      } as any) as any;
    }

    // DSM: themselves + delegates in their managed teams only
    if (businessRole === 'DSM' && orgUserId) {
      // Get all teams the DSM manages
      const managedTeams = await this.prisma.team.findMany({
        where: { organizationId: orgId, managerId: orgUserId },
        select: { id: true },
      });
      const managedTeamIds = managedTeams.map((t) => t.id);

      return this.prisma.organizationUser.findMany({
        where: {
          organizationId: orgId,
          isActive: true,
          OR: [
            { id: orgUserId },                                       // themselves
            { teamId: { in: managedTeamIds }, businessRole: 'DELEGATE' }, // delegates in their teams
          ],
        },
        include: baseInclude,
        orderBy: { createdAt: 'asc' },
      } as any) as any;
    }

    // NSM: field members only (DSM + DELEGATE) — no ASSISTANT visibility
    if (businessRole === 'NSM') {
      return this.prisma.organizationUser.findMany({
        where: {
          organizationId: orgId,
          isActive: true,
          businessRole: { in: ['NSM', 'DSM', 'DELEGATE'] as any },
        },
        include: baseInclude,
        orderBy: { createdAt: 'asc' },
      } as any) as any;
    }

    // ASSISTANT / ADMIN: all members
    return this.prisma.organizationUser.findMany({
      where: { organizationId: orgId, isActive: true },
      include: baseInclude,
      orderBy: { createdAt: 'asc' },
    } as any) as any;
  }

  /**
   * Get a single org user — with role-based access check.
   * - DSM can only view themselves or delegates in their managed teams
   * - NSM cannot view ASSISTANT users
   * - ASSISTANT / ADMIN can view anyone in the org
   */
  async findOne(
    id: string,
    orgId: string,
    orgUserId?: string,
    businessRole?: string,
  ) {
    const target = await this.prisma.organizationUser.findUnique({
      where: { id },
      include: {
        User: true,
        Team_OrganizationUser_teamIdToTeam: true,
        OrganizationUser: { include: { User: { select: { firstName: true, lastName: true } } } },
        other_OrganizationUser: { include: { User: { select: { firstName: true, lastName: true } } } },
        Visit: { orderBy: { visitedAt: 'desc' }, take: 10, include: { doctor: true } },
      },
    } as any) as any;

    if (!target || target.organizationId !== orgId) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    // DSM: can only view themselves or delegates in their managed teams
    if (businessRole === 'DSM' && orgUserId && id !== orgUserId) {
      const managedTeams = await this.prisma.team.findMany({
        where: { organizationId: orgId, managerId: orgUserId },
        select: { id: true },
      });
      const managedTeamIds = managedTeams.map((t) => t.id);
      if (
        !target.teamId ||
        !managedTeamIds.includes(target.teamId) ||
        target.businessRole !== 'DELEGATE'
      ) {
        throw new ForbiddenException('Vous ne pouvez consulter que les membres de vos équipes');
      }
    }

    // NSM: cannot view ASSISTANT users
    if (businessRole === 'NSM' && target.businessRole === 'ASSISTANT') {
      throw new ForbiddenException('Le NSM ne peut pas consulter les profils assistants');
    }

    // DELEGATE: can only view themselves
    if (businessRole === 'DELEGATE' && orgUserId && id !== orgUserId) {
      throw new ForbiddenException('Vous ne pouvez consulter que votre propre profil');
    }

    return target;
  }

  /** Invite a new user to the organization */
  async create(dto: CreateOrgUserDto, orgId: string) {
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
    } as any) as any;
  }

  async update(id: string, dto: Partial<CreateOrgUserDto>) {
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
      } as any,
    });
  }

  async deactivate(id: string) {
    return this.prisma.organizationUser.update({
      where: { id },
      data: { isActive: false, updatedAt: new Date() },
    });
  }

  /**
   * All teams in org — filtered by role:
   * - DELEGATE → only their own team
   * - DSM → only teams they manage (shows delegates grouped by team)
   * - NSM → all teams, but team members exclude ASSISTANT role
   * - ASSISTANT / ADMIN → all teams with all members
   */
  async getTeams(orgId: string, orgUserId?: string, businessRole?: string) {
    // Base include for team members — delegates grouped under their team
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

    // NSM-specific include — excludes ASSISTANT users from team member lists
    const teamIncludeNoAssistant = {
      OrganizationUser_OrganizationUser_teamIdToTeam: {
        where: {
          isActive: true,
          businessRole: { not: 'ASSISTANT' as any },
        },
        include: {
          User: { select: { firstName: true, lastName: true, email: true, phone: true } },
          Sector: { select: { id: true, name: true } },
        },
      },
      OrganizationUser_Team_managerIdToOrganizationUser: {
        include: { User: { select: { firstName: true, lastName: true } } },
      },
    };

    // DSM: only their managed teams
    if (businessRole === 'DSM' && orgUserId) {
      return this.prisma.team.findMany({
        where: { organizationId: orgId, managerId: orgUserId },
        include: teamInclude,
      } as any) as any;
    }

    // DELEGATE: only their own team
    if (businessRole === 'DELEGATE' && orgUserId) {
      const delegate = await this.prisma.organizationUser.findUnique({
        where: { id: orgUserId },
        select: { teamId: true },
      });
      if (!delegate?.teamId) return [];
      return this.prisma.team.findMany({
        where: { organizationId: orgId, id: delegate.teamId },
        include: teamInclude,
      } as any) as any;
    }

    // NSM: all teams but exclude ASSISTANT from member lists
    if (businessRole === 'NSM') {
      return this.prisma.team.findMany({
        where: { organizationId: orgId },
        include: teamIncludeNoAssistant,
      } as any) as any;
    }

    // ASSISTANT / ADMIN: all teams with all members
    return this.prisma.team.findMany({
      where: { organizationId: orgId },
      include: teamInclude,
    } as any) as any;
  }
}
