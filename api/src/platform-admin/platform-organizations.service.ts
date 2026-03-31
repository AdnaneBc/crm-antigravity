import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateOrganizationDto {
  @IsString() name: string;
  @IsOptional() @IsString() logoUrl?: string;
  @IsOptional() @IsString() primaryColor?: string;
  @IsOptional() @IsString() secondaryColor?: string;
}

export class UpdateOrganizationDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() logoUrl?: string;
  @IsOptional() @IsString() primaryColor?: string;
  @IsOptional() @IsString() secondaryColor?: string;
}

export class AssignSubscriptionDto {
  @IsString() planId: string;
}

@Injectable()
export class PlatformOrganizationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string, status?: string) {
    const where: any = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (status === 'active') where.isActive = true;
    else if (status === 'suspended') where.isActive = false;

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

  async findOne(id: string) {
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

    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async create(dto: CreateOrganizationDto) {
    return this.prisma.organization.create({
      data: {
        name: dto.name,
        logoUrl: dto.logoUrl,
        primaryColor: dto.primaryColor,
        secondaryColor: dto.secondaryColor,
      },
    });
  }

  async update(id: string, dto: UpdateOrganizationDto) {
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

  async activate(id: string) {
    return this.prisma.organization.update({
      where: { id },
      data: { isActive: true, suspendedAt: null },
    });
  }

  async suspend(id: string) {
    return this.prisma.organization.update({
      where: { id },
      data: { isActive: false, suspendedAt: new Date() },
    });
  }

  async assignSubscription(id: string, dto: AssignSubscriptionDto) {
    // Cancel any existing active subscription
    await this.prisma.organizationSubscription.updateMany({
      where: { organizationId: id, status: { in: ['ACTIVE', 'TRIAL'] } },
      data: { status: 'CANCELLED', updatedAt: new Date() },
    });

    // Create new subscription
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
}
