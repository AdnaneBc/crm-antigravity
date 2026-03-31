import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, IsOptional, IsNumber, IsArray, IsBoolean, IsEnum } from 'class-validator';

export class CreatePlanDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsNumber() price: number;
  @IsOptional() @IsString() interval?: string;
  @IsOptional() @IsNumber() maxUsers?: number;
  @IsOptional() @IsNumber() maxDoctors?: number;
  @IsOptional() @IsArray() features?: string[];
}

export class UpdatePlanDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() price?: number;
  @IsOptional() @IsString() interval?: string;
  @IsOptional() @IsNumber() maxUsers?: number;
  @IsOptional() @IsNumber() maxDoctors?: number;
  @IsOptional() @IsArray() features?: string[];
  @IsOptional() @IsBoolean() isActive?: boolean;
}

export class UpdateInvoiceDto {
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() notes?: string;
}

@Injectable()
export class PlatformBillingService {
  constructor(private prisma: PrismaService) {}

  // ─── PLANS ──────────────────────────────────────────────────────────
  async findAllPlans() {
    return this.prisma.subscriptionPlan.findMany({
      include: {
        _count: { select: { OrganizationSubscription: true } },
      },
      orderBy: { price: 'asc' },
    });
  }

  async createPlan(dto: CreatePlanDto) {
    return this.prisma.subscriptionPlan.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        interval: (dto.interval as any) || 'MONTHLY',
        maxUsers: dto.maxUsers ?? 50,
        maxDoctors: dto.maxDoctors ?? 500,
        features: dto.features ?? [],
      },
    });
  }

  async updatePlan(id: string, dto: UpdatePlanDto) {
    return this.prisma.subscriptionPlan.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.interval !== undefined && { interval: dto.interval as any }),
        ...(dto.maxUsers !== undefined && { maxUsers: dto.maxUsers }),
        ...(dto.maxDoctors !== undefined && { maxDoctors: dto.maxDoctors }),
        ...(dto.features !== undefined && { features: dto.features }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
  }

  // ─── SUBSCRIPTIONS ──────────────────────────────────────────────────
  async findAllSubscriptions(status?: string) {
    const where: any = {};
    if (status) where.status = status;

    return this.prisma.organizationSubscription.findMany({
      where,
      include: {
        Organization: { select: { id: true, name: true, isActive: true } },
        Plan: { select: { id: true, name: true, price: true, interval: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── INVOICES ───────────────────────────────────────────────────────
  async findAllInvoices(status?: string, organizationId?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (organizationId) where.organizationId = organizationId;

    return this.prisma.invoice.findMany({
      where,
      include: {
        Organization: { select: { id: true, name: true } },
        Subscription: {
          select: {
            Plan: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateInvoice(id: string, dto: UpdateInvoiceDto) {
    const data: any = {};
    if (dto.status) {
      data.status = dto.status;
      if (dto.status === 'PAID') data.paidAt = new Date();
    }
    if (dto.notes !== undefined) data.notes = dto.notes;

    return this.prisma.invoice.update({
      where: { id },
      data,
      include: {
        Organization: { select: { id: true, name: true } },
      },
    });
  }

  // ─── REVENUE ────────────────────────────────────────────────────────
  async revenueAnalytics() {
    // Revenue per organization
    const byOrg = await this.prisma.invoice.groupBy({
      by: ['organizationId'],
      where: { status: 'PAID' },
      _sum: { amount: true },
      _count: { id: true },
    });

    // Enrich with org names
    const orgIds = byOrg.map((r) => r.organizationId);
    const orgs = await this.prisma.organization.findMany({
      where: { id: { in: orgIds } },
      select: { id: true, name: true },
    });
    const orgMap = new Map(orgs.map((o) => [o.id, o.name]));

    return byOrg.map((r) => ({
      organizationId: r.organizationId,
      organizationName: orgMap.get(r.organizationId) || 'Unknown',
      totalRevenue: r._sum.amount || 0,
      invoiceCount: r._count.id,
    }));
  }
}
