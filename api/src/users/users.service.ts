import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { BusinessRole, OrganizationRole } from '@prisma/client';

export class CreateOrgUserDto {
  @IsEmail() email: string;
  @IsString() name: string;
  @IsString() password: string;
  @IsOptional() @IsEnum(BusinessRole) businessRole?: BusinessRole;
  @IsEnum(OrganizationRole) @IsOptional() organizationRole?: OrganizationRole;
  @IsOptional() @IsString() teamId?: string;
  @IsOptional() @IsString() managerId?: string;
  @IsOptional() @IsString() phone?: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /** All org members with user info */
  async findAll(orgId: string) {
    return this.prisma.organizationUser.findMany({
      where: { organizationId: orgId, isActive: true },
      include: {
        User: { select: { id: true, name: true, email: true, profileImageUrl: true, phone: true } },
        Team_OrganizationUser_teamIdToTeam: { select: { id: true, name: true } },
        OrganizationUser: { select: { id: true, User: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.organizationUser.findUnique({
      where: { id },
      include: {
        User: true,
        Team_OrganizationUser_teamIdToTeam: true,
        OrganizationUser: { include: { User: { select: { name: true } } } },
        other_OrganizationUser: { include: { User: { select: { name: true } } } },
        Visit: { orderBy: { visitedAt: 'desc' }, take: 10, include: { doctor: true } },
      },
    });
  }

  /** Invite a new user to the organization */
  async create(dto: CreateOrgUserDto, orgId: string) {
    const passwordHash = await bcrypt.hash(dto.password, 12);

    // Create or find user by email
    const user = await this.prisma.user.upsert({
      where: { email: dto.email },
      update: {},
      create: {
        email: dto.email,
        name: dto.name,
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
        updatedAt: new Date(),
      },
      include: { User: { select: { id: true, name: true, email: true } } },
    });
  }

  async update(id: string, dto: Partial<CreateOrgUserDto>) {
    return this.prisma.organizationUser.update({
      where: { id },
      data: {
        businessRole: dto.businessRole,
        organizationRole: dto.organizationRole,
        teamId: dto.teamId,
        managerId: dto.managerId,
        updatedAt: new Date(),
      },
    });
  }

  async deactivate(id: string) {
    return this.prisma.organizationUser.update({
      where: { id },
      data: { isActive: false, updatedAt: new Date() },
    });
  }

  /** All teams in org */
  async getTeams(orgId: string) {
    return this.prisma.team.findMany({
      where: { organizationId: orgId },
      include: {
        OrganizationUser_OrganizationUser_teamIdToTeam: {
          include: { User: { select: { name: true, email: true } } },
        },
        OrganizationUser_Team_managerIdToOrganizationUser: {
          include: { User: { select: { name: true } } },
        },
      },
    });
  }
}
