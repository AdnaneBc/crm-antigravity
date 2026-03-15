import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VisitStatus } from '@prisma/client';

// ─── DTOs ──────────────────────────────────────────────────────────────────────

export class CreateVisitDto {
  @IsString() doctorId: string;
  @IsDateString() visitedAt: string;         // the planned date
  @IsOptional() @IsString() delegateId?: string;
  @IsOptional() @IsString() notes?: string;  // planning notes only
}

export class UpdateVisitDto {
  @IsOptional() @IsDateString() visitedAt?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsEnum(VisitStatus) status?: VisitStatus;
}

export class ReportDistributionItemDto {
  @IsString() itemId: string;
  @IsNumber() @Type(() => Number) quantity: number;
}

export class SubmitReportDto {
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() productsPresented?: string;
  @IsOptional() @IsArray() distributions?: ReportDistributionItemDto[];
  @IsOptional() @IsDateString() nextVisitDate?: string;
}

// ─── Service ───────────────────────────────────────────────────────────────────

@Injectable()
export class VisitsService {
  constructor(private prisma: PrismaService) {}

  // ─── LIST ─────────────────────────────────────────────────────────────────

  async findAll(orgId: string, orgUserId: string, businessRole: string, query?: any) {
    const where: any = { organizationId: orgId };

    if (businessRole === 'DELEGATE') {
      where.delegateId = orgUserId;
    } else if (businessRole === 'DSM') {
      const teamIds = await this._getDsmTeamDelegateIds(orgUserId);
      where.delegateId = { in: [...teamIds, orgUserId] };
    }

    if (query?.doctorId) where.doctorId = query.doctorId;
    if (query?.delegateId) where.delegateId = query.delegateId;
    if (query?.status) where.status = query.status;

    return this.prisma.visit.findMany({
      where,
      orderBy: { visitedAt: 'desc' },
      include: {
        doctor: {
          select: { id: true, firstName: true, lastName: true, speciality: true, type: true },
        },
        OrganizationUser: {
          include: { User: { select: { name: true, email: true } } },
        },
        VisitDistribution: {
          include: { PromotionalItem: { select: { id: true, name: true, type: true } } },
        },
      },
    });
  }

  async findOne(id: string, orgId: string) {
    return this.prisma.visit.findFirst({
      where: { id, organizationId: orgId },
      include: {
        doctor: true,
        OrganizationUser: { include: { User: true } },
        VisitDistribution: { include: { PromotionalItem: true } },
      },
    });
  }

  // ─── TEAM DELEGATES ───────────────────────────────────────────────────────

  async getTeamDelegates(orgUserId: string, orgId: string) {
    return this.prisma.organizationUser.findMany({
      where: { organizationId: orgId, isActive: true, businessRole: 'DELEGATE', managerId: orgUserId },
      select: {
        id: true,
        businessRole: true,
        User: { select: { name: true, email: true } },
        Team_OrganizationUser_teamIdToTeam: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  // ─── CREATE (planning phase) ───────────────────────────────────────────────

  async create(
    dto: CreateVisitDto,
    orgUserId: string,
    orgId: string,
    businessRole: string,
  ) {
    let resolvedDelegateId: string;

    if (businessRole === 'DELEGATE') {
      resolvedDelegateId = orgUserId;
    } else if (businessRole === 'DSM') {
      if (!dto.delegateId) {
        resolvedDelegateId = orgUserId;
      } else {
        await this._assertDelegateInDsmTeam(orgUserId, dto.delegateId);
        resolvedDelegateId = dto.delegateId;
      }
    } else {
      resolvedDelegateId = dto.delegateId ?? orgUserId;
    }

    return this.prisma.visit.create({
      data: {
        organizationId: orgId,
        delegateId: resolvedDelegateId,
        doctorId: dto.doctorId,
        visitedAt: new Date(dto.visitedAt),
        status: 'PLANNED',
        notes: dto.notes,
        updatedAt: new Date(),
      },
      include: {
        doctor: { select: { firstName: true, lastName: true } },
        OrganizationUser: { include: { User: { select: { name: true } } } },
      },
    });
  }

  // ─── SUBMIT REPORT (reporting phase) ──────────────────────────────────────

  async submitReport(
    id: string,
    dto: SubmitReportDto,
    orgUserId: string,
    orgId: string,
    businessRole: string,
  ) {
    const visit = await this.prisma.visit.findFirst({ where: { id, organizationId: orgId } });
    if (!visit) throw new NotFoundException('Visite introuvable');
    if (visit.status === 'COMPLETED') {
      throw new ConflictException('Un rapport a déjà été soumis pour cette visite');
    }
    if (visit.status === 'CANCELLED') {
      throw new BadRequestException('Impossible de rapporter une visite annulée');
    }

    // Authorization check
    if (businessRole === 'DELEGATE' && visit.delegateId !== orgUserId) {
      throw new ForbiddenException('Vous ne pouvez soumettre un rapport que pour vos propres visites');
    }
    if (businessRole === 'DSM' && visit.delegateId !== orgUserId) {
      await this._assertDelegateInDsmTeam(orgUserId, visit.delegateId);
    }

    const distributions = dto.distributions?.filter((d) => d.quantity > 0) ?? [];

    // Validate stock availability before committing
    for (const d of distributions) {
      const stock = await this.prisma.stockAllocation.findFirst({
        where: { delegateId: visit.delegateId, itemId: d.itemId },
      });
      if (!stock || stock.quantity < d.quantity) {
        const item = await this.prisma.promotionalItem.findUnique({ where: { id: d.itemId } });
        throw new BadRequestException(
          `Stock insuffisant pour "${item?.name ?? d.itemId}": disponible ${stock?.quantity ?? 0}, demandé ${d.quantity}`,
        );
      }
    }

    // Transactional update
    return this.prisma.$transaction(async (tx) => {
      // 1. Update visit to COMPLETED + add report fields
      const updated = await tx.visit.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          description: dto.description,
          nextVisitDate: dto.nextVisitDate ? new Date(dto.nextVisitDate) : undefined,
          updatedAt: new Date(),
        },
        include: {
          doctor: { select: { firstName: true, lastName: true } },
          OrganizationUser: { include: { User: { select: { name: true } } } },
          VisitDistribution: { include: { PromotionalItem: true } },
        },
      });

      // 2. Create VisitDistribution records
      for (const d of distributions) {
        const distId = `${id}-${d.itemId}`.replace(/-/g, '').substring(0, 25);
        await tx.visitDistribution.upsert({
          where: { visitId_itemId: { visitId: id, itemId: d.itemId } },
          create: {
            id: distId,
            organizationId: orgId,
            visitId: id,
            itemId: d.itemId,
            quantity: d.quantity,
            updatedAt: new Date(),
          },
          update: { quantity: d.quantity, updatedAt: new Date() },
        });
      }

      // 3. Deduct from StockAllocation
      for (const d of distributions) {
        await tx.stockAllocation.updateMany({
          where: { delegateId: visit.delegateId, itemId: d.itemId },
          data: { quantity: { decrement: d.quantity }, updatedAt: new Date() },
        });
      }

      return updated;
    });
  }

  // ─── UPDATE (planning fields only) ────────────────────────────────────────

  async update(
    id: string,
    dto: UpdateVisitDto,
    orgUserId: string,
    orgId: string,
    businessRole: string,
  ) {
    const visit = await this.prisma.visit.findFirst({ where: { id, organizationId: orgId } });
    if (!visit) throw new NotFoundException('Visite introuvable');
    if (visit.status === 'COMPLETED') {
      throw new BadRequestException('Une visite complétée ne peut plus être modifiée');
    }
    if (businessRole === 'DELEGATE' && visit.delegateId !== orgUserId) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres visites');
    }
    if (businessRole === 'DSM' && visit.delegateId !== orgUserId) {
      await this._assertDelegateInDsmTeam(orgUserId, visit.delegateId);
    }

    return this.prisma.visit.update({
      where: { id },
      data: {
        notes: dto.notes,
        visitedAt: dto.visitedAt ? new Date(dto.visitedAt) : undefined,
        status: dto.status,
        updatedAt: new Date(),
      },
    });
  }

  // ─── DELETE ───────────────────────────────────────────────────────────────

  async remove(id: string, orgUserId: string, orgId: string, businessRole: string) {
    const visit = await this.prisma.visit.findFirst({ where: { id, organizationId: orgId } });
    if (!visit) throw new NotFoundException('Visite introuvable');
    if (businessRole === 'DELEGATE' && visit.delegateId !== orgUserId) {
      throw new ForbiddenException('Vous ne pouvez supprimer que vos propres visites');
    }
    if (businessRole === 'DSM' && visit.delegateId !== orgUserId) {
      await this._assertDelegateInDsmTeam(orgUserId, visit.delegateId);
    }
    await this.prisma.visitDistribution.deleteMany({ where: { visitId: id } });
    return this.prisma.visit.delete({ where: { id } });
  }

  // ─── PRIVATE HELPERS ──────────────────────────────────────────────────────

  private async _getDsmTeamDelegateIds(dsmOrgUserId: string): Promise<string[]> {
    const delegates = await this.prisma.organizationUser.findMany({
      where: { managerId: dsmOrgUserId, businessRole: 'DELEGATE', isActive: true },
      select: { id: true },
    });
    return delegates.map((d) => d.id);
  }

  private async _assertDelegateInDsmTeam(dsmOrgUserId: string, targetDelegateId: string) {
    const delegate = await this.prisma.organizationUser.findFirst({
      where: { id: targetDelegateId, managerId: dsmOrgUserId, businessRole: 'DELEGATE', isActive: true },
    });
    if (!delegate) {
      throw new ForbiddenException('Ce délégué ne fait pas partie de votre équipe');
    }
  }
}
