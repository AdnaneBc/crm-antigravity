import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PromoItemType } from '@prisma/client';

export class CreatePromoItemDto {
  @IsString() name: string;
  @IsEnum(PromoItemType) type: PromoItemType;
  @IsNumber() @Type(() => Number) totalStock: number;
  @IsOptional() @IsNumber() @Min(0) @Type(() => Number) minStockLevel?: number;
}

export class AllocateStockDto {
  @IsString() delegateId: string; // OrganizationUser id
  @IsNumber() @Type(() => Number) quantity: number;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // ── Promotional Items ─────────────────────────────────────────────────────

  async findAll(orgId: string) {
    return this.prisma.promotionalItem.findMany({
      where: { organizationId: orgId },
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { VisitDistribution: true, StockAllocation: true } },
        StockAllocation: {
          include: {
            OrganizationUser: { include: { User: { select: { firstName: true, lastName: true } as any } } },
          },
        },
      },
    } as any) as any;
  }

  async findOne(id: string, orgId: string) {
    return this.prisma.promotionalItem.findFirst({
      where: { id, organizationId: orgId },
      include: {
        StockAllocation: {
          include: { OrganizationUser: { include: { User: { select: { firstName: true, lastName: true } as any } } } },
        },
        VisitDistribution: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: { Visit: { include: { doctor: { select: { firstName: true, lastName: true } } } } },
        },
      },
    } as any) as any;
  }

  async create(dto: CreatePromoItemDto, orgId: string) {
    return (this.prisma.promotionalItem.create as any)({
      data: {
        id: `item-${Date.now()}`,
        organizationId: orgId,
        name: dto.name,
        type: dto.type,
        totalStock: dto.totalStock,
        minStockLevel: dto.minStockLevel ?? 0,
        updatedAt: new Date(),
      },
    });
  }

  async update(id: string, dto: Partial<CreatePromoItemDto>) {
    return this.prisma.promotionalItem.update({
      where: { id },
      data: { ...dto, updatedAt: new Date() } as any,
    });
  }

  async remove(id: string) {
    return this.prisma.promotionalItem.delete({ where: { id } });
  }

  // ── Stock Allocations ─────────────────────────────────────────────────────

  async allocateStock(itemId: string, dto: AllocateStockDto, orgId: string) {
    const item = await this.prisma.promotionalItem.findFirst({ where: { id: itemId, organizationId: orgId } });
    if (!item) throw new NotFoundException('Item promotionnel introuvable');

    // Upsert: if an allocation already exists for this delegate+item, increment
    const existing = await this.prisma.stockAllocation.findFirst({
      where: { itemId, delegateId: dto.delegateId, organizationId: orgId },
    });

    if (existing) {
      return this.prisma.stockAllocation.update({
        where: { id: existing.id },
        data: { quantity: { increment: dto.quantity }, updatedAt: new Date() },
      });
    }

    const id = `alloc-${itemId}-${dto.delegateId}-${Date.now()}`;
    return this.prisma.stockAllocation.create({
      data: {
        id,
        organizationId: orgId,
        itemId,
        delegateId: dto.delegateId,
        quantity: dto.quantity,
        updatedAt: new Date(),
      },
    });
  }

  async getDelegateStock(orgUserId: string, orgId: string) {
    return this.prisma.stockAllocation.findMany({
      where: { delegateId: orgUserId, organizationId: orgId },
      include: {
        PromotionalItem: { select: { id: true, name: true, type: true, minStockLevel: true } as any },
      },
    } as any) as any;
  }

  // ── Stock Alerts — items at or below minStockLevel ────────────────────────

  async getStockAlerts(orgId: string) {
    // Fetch all, filter in JS (Prisma can't compare two columns directly in WHERE)
    const items = await this.prisma.promotionalItem.findMany({
      where: { organizationId: orgId },
    }) as any[];
    return items
      .filter((item: any) => (item.minStockLevel ?? 0) > 0 && item.totalStock <= item.minStockLevel)
      .map((item: any) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        totalStock: item.totalStock,
        minStockLevel: item.minStockLevel,
        isZero: item.totalStock === 0,
      }));
  }
}
