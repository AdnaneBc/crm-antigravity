import { Injectable } from '@nestjs/common';
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
   * - DSM → their direct delegates + themselves
   * - NSM / ASSISTANT / ADMIN → all members
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

    // DSM: themselves + their direct reports (delegates)
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
      } as any) as any;
    }

    // NSM / ASSISTANT / ADMIN: all members
    return this.prisma.organizationUser.findMany({
      where: { organizationId: orgId, isActive: true },
      include: baseInclude,
      orderBy: { createdAt: 'asc' },
    } as any) as any;
  }

  async findOne(id: string) {
    return this.prisma.organizationUser.findUnique({
      where: { id },
      include: {
        User: true,
        Team_OrganizationUser_teamIdToTeam: true,
        OrganizationUser: { include: { User: { select: { firstName: true, lastName: true } } } },
        other_OrganizationUser: { include: { User: { select: { firstName: true, lastName: true } } } },
        Visit: { orderBy: { visitedAt: 'desc' }, take: 10, include: { doctor: true } },
      },
    } as any) as any;
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
   * - DSM → only teams they manage
   * - NSM / ASSISTANT → all teams
   */
  async getTeams(orgId: string, orgUserId?: string, businessRole?: string) {
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

    // NSM / ASSISTANT / ADMIN: all teams
    return this.prisma.team.findMany({
      where: { organizationId: orgId },
      include: teamInclude,
    } as any) as any;
  }
}
