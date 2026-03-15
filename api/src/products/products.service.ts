import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { PromoItemType } from '@prisma/client';

export class CreatePromoItemDto {
  @IsString() name: string;
  @IsEnum(PromoItemType) type: PromoItemType;
  @IsNumber() @Type(() => Number) totalStock: number;
}

export class AllocateStockDto {
  @IsString() delegateId: string; // OrganizationUser id
  @IsNumber() @Type(() => Number) quantity: number;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // ── Promotional Items (replaced "products" in the real schema) ──────────────

  async findAll(orgId: string) {
    return this.prisma.promotionalItem.findMany({
      where: { organizationId: orgId },
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { VisitDistribution: true, StockAllocation: true } },
        StockAllocation: {
          include: {
            OrganizationUser: { include: { User: { select: { name: true } } } },
          },
        },
      },
    });
  }

  async findOne(id: string, orgId: string) {
    return this.prisma.promotionalItem.findFirst({
      where: { id, organizationId: orgId },
      include: {
        StockAllocation: {
          include: { OrganizationUser: { include: { User: { select: { name: true } } } } },
        },
        VisitDistribution: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: { Visit: { include: { doctor: { select: { firstName: true, lastName: true } } } } },
        },
      },
    });
  }

  async create(dto: CreatePromoItemDto, orgId: string) {
    return this.prisma.promotionalItem.create({
      data: {
        id: `item-${Date.now()}`,
        organizationId: orgId,
        name: dto.name,
        type: dto.type,
        totalStock: dto.totalStock,
        updatedAt: new Date(),
      },
    });
  }

  async update(id: string, dto: Partial<CreatePromoItemDto>) {
    return this.prisma.promotionalItem.update({
      where: { id },
      data: { ...dto, updatedAt: new Date() },
    });
  }

  async remove(id: string) {
    return this.prisma.promotionalItem.delete({ where: { id } });
  }

  // ── Stock Allocations ────────────────────────────────────────────────────────

  async allocateStock(itemId: string, dto: AllocateStockDto, orgId: string) {
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
        PromotionalItem: { select: { name: true, type: true } },
      },
    });
  }
}
