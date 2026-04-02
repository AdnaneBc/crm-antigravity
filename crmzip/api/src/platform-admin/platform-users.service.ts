import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, IsEmail, IsOptional, IsEnum, IsArray } from 'class-validator';
import * as bcrypt from 'bcryptjs';

export class CreatePlatformUserDto {
  @IsEmail() email: string;
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsString() password: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() platformRole?: string;
}

export class UpdatePlatformUserDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() platformRole?: string;
}

export class AssignOrganizationDto {
  @IsString() organizationId: string;
  @IsOptional() @IsString() organizationRole?: string;
  @IsOptional() @IsString() businessRole?: string;
}

export class ResetPasswordDto {
  @IsString() newPassword: string;
}

@Injectable()
export class PlatformUsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string) {
    const where: any = {};
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

  async findOne(id: string) {
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

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreatePlatformUserDto) {
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

  async update(id: string, dto: UpdatePlatformUserDto) {
    const data: any = {};
    if (dto.firstName !== undefined) data.firstName = dto.firstName;
    if (dto.lastName !== undefined) data.lastName = dto.lastName;
    if (dto.phone !== undefined) data.phone = dto.phone;
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

  async deactivate(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async resetPassword(id: string, dto: ResetPasswordDto) {
    const passwordHash = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
    return { message: 'Password reset successfully' };
  }

  async assignOrganization(userId: string, dto: AssignOrganizationDto) {
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
        organizationRole: (dto.organizationRole as any) || 'MEMBER',
        businessRole: (dto.businessRole as any) || undefined,
        updatedAt: new Date(),
      },
      create: {
        id: orgUserId,
        userId,
        organizationId: dto.organizationId,
        organizationRole: (dto.organizationRole as any) || 'MEMBER',
        businessRole: (dto.businessRole as any) || undefined,
        updatedAt: new Date(),
      },
      include: {
        Organization: { select: { id: true, name: true } },
      },
    });
  }

  async revokeOrganization(userId: string, orgId: string) {
    const record = await this.prisma.organizationUser.findUnique({
      where: {
        userId_organizationId: { userId, organizationId: orgId },
      },
    });

    if (!record) throw new NotFoundException('Organization membership not found');

    return this.prisma.organizationUser.update({
      where: { id: record.id },
      data: { isActive: false, updatedAt: new Date() },
    });
  }
}
