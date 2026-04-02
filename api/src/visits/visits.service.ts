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
  @IsOptional() @IsString() notes?: string;  // planning notes only
}

export class BatchCreateVisitDto {
  @IsArray() @IsString({ each: true }) doctorIds: string[];
  @IsDateString() visitedAt: string;  // day only (date without time, e.g. "2026-04-05")
  @IsOptional() @IsString() notes?: string;
}

export class UpdateVisitDto {
  @IsOptional() @IsDateString() visitedAt?: string;
  @IsOptional() @IsString() notes?: string;
}

export class ValidateVisitDto {
  @IsEnum(['approve', 'reject']) action: 'approve' | 'reject';
  @IsOptional() @IsString() rejectionReason?: string;
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
      const teamDelegateIds = await this._getDsmTeamDelegateIdsByTeam(orgUserId, orgId);
      where.delegateId = { in: [...teamDelegateIds, orgUserId] };
    }
    // NSM sees all visits in the org (no additional filter)
    // ASSISTANT sees all visits in the org (for logistics visibility)

    if (query?.doctorId) where.doctorId = query.doctorId;
    if (query?.delegateId && businessRole !== 'DELEGATE') where.delegateId = query.delegateId;
    if (query?.status) where.status = query.status;

    // Team-based filtering — allows DSM/NSM to filter by teamId
    if (query?.teamId) {
      const teamMembers = await this.prisma.organizationUser.findMany({
        where: { teamId: query.teamId, isActive: true },
        select: { id: true },
      });
      const memberIds = teamMembers.map((m) => m.id);
      // Intersect with existing delegateId filter if present
      if (where.delegateId?.in) {
        where.delegateId = { in: where.delegateId.in.filter((id: string) => memberIds.includes(id)) };
      } else if (!where.delegateId) {
        where.delegateId = { in: memberIds };
      }
    }

    // Date range filtering
    if (query?.startDate || query?.endDate) {
      where.visitedAt = {};
      if (query.startDate) where.visitedAt.gte = new Date(query.startDate);
      if (query.endDate) where.visitedAt.lte = new Date(query.endDate);
    }

    return this.prisma.visit.findMany({
      where,
      orderBy: { visitedAt: 'desc' },
      include: {
        doctor: {
          select: { id: true, firstName: true, lastName: true, speciality: true, type: true },
        },
        OrganizationUser: {
          include: { User: { select: { firstName: true, lastName: true, email: true } as any } },
        },
        VisitDistribution: {
          include: { PromotionalItem: { select: { id: true, name: true, type: true } } },
        },
      },
    } as any) as any;
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

  // ─── TEAM DELEGATES (DSM only) ────────────────────────────────────────────

  async getTeamDelegates(orgUserId: string, orgId: string) {
    return this.prisma.organizationUser.findMany({
      where: { organizationId: orgId, isActive: true, businessRole: 'DELEGATE', managerId: orgUserId },
      select: {
        id: true,
        businessRole: true,
        User: { select: { firstName: true, lastName: true, email: true } as any },
        Team_OrganizationUser_teamIdToTeam: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'asc' },
    } as any) as any;
  }

  // ─── PENDING VALIDATION COUNT (for DSM alert badge) ───────────────────────

  async getPendingValidationCount(orgUserId: string, orgId: string, businessRole: string) {
    if (businessRole !== 'DSM') return { count: 0 };
    const delegateIds = await this._getDsmTeamDelegateIds(orgUserId);
    const count = await this.prisma.visit.count({
      where: {
        organizationId: orgId,
        status: 'PENDING_VALIDATION' as any,
        delegateId: { in: delegateIds },
      },
    });
    return { count };
  }

  // ─── CREATE (planning phase) ──────────────────────────────────────────────
  // DELEGATE → PENDING_VALIDATION, DSM → APPROVED (auto-approval for own visits)

  async create(
    dto: CreateVisitDto,
    orgUserId: string,
    orgId: string,
    businessRole: string,
  ) {
    // NSM and ASSISTANT cannot plan visits
    if (businessRole === 'NSM') {
      throw new ForbiddenException('Le NSM ne peut pas planifier de visites');
    }
    if (businessRole === 'ASSISTANT') {
      throw new ForbiddenException("L'assistant ne peut pas planifier de visites");
    }

    // DSM auto-approves their own visits; DELEGATE needs validation
    const status = businessRole === 'DSM' ? 'APPROVED' : 'PENDING_VALIDATION';

    return this.prisma.visit.create({
      data: {
        organizationId: orgId,
        delegateId: orgUserId,
        doctorId: dto.doctorId,
        visitedAt: new Date(dto.visitedAt),
        status: status as any,
        notes: dto.notes,
        ...(businessRole === 'DSM' ? { validatedById: orgUserId, validatedAt: new Date() } : {}),
        updatedAt: new Date(),
      },
      include: {
        doctor: { select: { firstName: true, lastName: true } },
        OrganizationUser: { include: { User: { select: { firstName: true, lastName: true } as any } } },
      },
    } as any) as any;
  }

  // ─── BATCH CREATE (daily planning — multiple doctors for one day) ───────────

  async createBatch(
    dto: BatchCreateVisitDto,
    orgUserId: string,
    orgId: string,
    businessRole: string,
  ) {
    if (businessRole === 'NSM') {
      throw new ForbiddenException('Le NSM ne peut pas planifier de visites');
    }
    if (businessRole === 'ASSISTANT') {
      throw new ForbiddenException("L'assistant ne peut pas planifier de visites");
    }
    if (!dto.doctorIds?.length) {
      throw new BadRequestException('Vous devez sélectionner au moins un médecin');
    }

    const status = businessRole === 'DSM' ? 'APPROVED' : 'PENDING_VALIDATION';
    const planDate = new Date(dto.visitedAt);

    const created = [];
    for (const doctorId of dto.doctorIds) {
      const visit = await this.prisma.visit.create({
        data: {
          organizationId: orgId,
          delegateId: orgUserId,
          doctorId,
          visitedAt: planDate,
          status: status as any,
          notes: dto.notes,
          ...(businessRole === 'DSM' ? { validatedById: orgUserId, validatedAt: new Date() } : {}),
          updatedAt: new Date(),
        },
        include: {
          doctor: { select: { firstName: true, lastName: true } },
          OrganizationUser: { include: { User: { select: { firstName: true, lastName: true } as any } } },
        },
      } as any) as any;
      created.push(visit);
    }

    return created;
  }

  // ─── VALIDATE (DSM approves or rejects a delegate's visit) ────────────────

  async validate(
    id: string,
    dto: ValidateVisitDto,
    orgUserId: string,
    orgId: string,
    businessRole: string,
  ) {
    if (businessRole !== 'DSM') {
      throw new ForbiddenException('Seul un DSM peut valider ou rejeter une visite');
    }

    const visit = await this.prisma.visit.findFirst({ where: { id, organizationId: orgId } });
    if (!visit) throw new NotFoundException('Visite introuvable');

    if ((visit.status as any) !== 'PENDING_VALIDATION') {
      throw new BadRequestException(
        `Impossible de valider une visite avec le statut "${visit.status}"`,
      );
    }

    // DSM can only validate visits belonging to delegates in their team
    // (they cannot validate their own visits through this endpoint — they always self-approve)
    if (visit.delegateId !== orgUserId) {
      await this._assertDelegateInDsmTeam(orgUserId, visit.delegateId);
    }

    const newStatus: any = dto.action === 'approve' ? 'APPROVED' : 'REJECTED';

    return this.prisma.visit.update({
      where: { id },
      data: {
        status: newStatus,
        validatedById: orgUserId,
        validatedAt: new Date(),
        rejectionReason: dto.action === 'reject' ? (dto.rejectionReason ?? null) : null,
        updatedAt: new Date(),
      } as any,
      include: {
        doctor: { select: { firstName: true, lastName: true } },
        OrganizationUser: { include: { User: { select: { firstName: true, lastName: true } as any } } },
      },
    } as any) as any;
  }

  // ─── SUBMIT REPORT (reporting phase — only for APPROVED visits) ────────────

  async submitReport(
    id: string,
    dto: SubmitReportDto,
    orgUserId: string,
    orgId: string,
    businessRole: string,
  ) {
    if (businessRole === 'NSM') {
      throw new ForbiddenException('Le NSM ne peut pas soumettre de rapport');
    }
    if (businessRole === 'ASSISTANT') {
      throw new ForbiddenException("L'assistant ne peut pas soumettre de rapport");
    }

    const visit = await this.prisma.visit.findFirst({ where: { id, organizationId: orgId } });
    if (!visit) throw new NotFoundException('Visite introuvable');

    if ((visit.status as any) === 'COMPLETED') {
      throw new ConflictException('Un rapport a déjà été soumis pour cette visite');
    }
    if ((visit.status as any) === 'CANCELLED') {
      throw new BadRequestException('Impossible de rapporter une visite annulée');
    }
    if ((visit.status as any) === 'REJECTED') {
      throw new BadRequestException('Impossible de rapporter une visite rejetée');
    }
    if ((visit.status as any) === 'PENDING_VALIDATION') {
      throw new BadRequestException(
        'Cette visite est en attente de validation. Elle doit être approuvée avant de soumettre un rapport.',
      );
    }
    // At this point, status must be APPROVED

    // Authorization: only the delegate who owns the visit (or themselves if DSM)
    if (businessRole === 'DELEGATE' && visit.delegateId !== orgUserId) {
      throw new ForbiddenException('Vous ne pouvez soumettre un rapport que pour vos propres visites');
    }
    if (businessRole === 'DSM' && visit.delegateId !== orgUserId) {
      throw new ForbiddenException('Le DSM ne peut soumettre un rapport que pour ses propres visites');
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
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Update visit to COMPLETED + add report fields
      const updated = await (tx.visit.update as any)({
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
          OrganizationUser: { include: { User: { select: { firstName: true, lastName: true } as any } } },
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

      // 3. Deduct from StockAllocation AND from PromotionalItem.totalStock
      for (const d of distributions) {
        await tx.stockAllocation.updateMany({
          where: { delegateId: visit.delegateId, itemId: d.itemId },
          data: { quantity: { decrement: d.quantity }, updatedAt: new Date() },
        });
        await tx.promotionalItem.update({
          where: { id: d.itemId },
          data: { totalStock: { decrement: d.quantity }, updatedAt: new Date() },
        });
      }

      return updated;
    });

    // 4. Check stock alerts after transaction (non-blocking)
    const alerts = await this._getStockAlerts(orgId);

    return { ...result, stockAlerts: alerts };
  }

  // ─── UPDATE (planning fields only — PENDING_VALIDATION or APPROVED only) ──

  async update(
    id: string,
    dto: UpdateVisitDto,
    orgUserId: string,
    orgId: string,
    businessRole: string,
  ) {
    const visit = await this.prisma.visit.findFirst({ where: { id, organizationId: orgId } });
    if (!visit) throw new NotFoundException('Visite introuvable');

    if ((visit.status as any) === 'COMPLETED') {
      throw new BadRequestException('Une visite complétée ne peut plus être modifiée');
    }
    if ((visit.status as any) === 'REJECTED' || visit.status === 'CANCELLED') {
      throw new BadRequestException('Cette visite ne peut plus être modifiée');
    }

    // Only the owning delegate (or the owning DSM) can update their visit
    if (businessRole === 'DELEGATE' && visit.delegateId !== orgUserId) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres visites');
    }
    if (businessRole === 'DSM' && visit.delegateId !== orgUserId) {
      throw new ForbiddenException('Le DSM ne peut modifier que ses propres visites planifiées');
    }

    return this.prisma.visit.update({
      where: { id },
      data: {
        notes: dto.notes,
        visitedAt: dto.visitedAt ? new Date(dto.visitedAt) : undefined,
        updatedAt: new Date(),
      },
    });
  }

  // ─── CANCEL ───────────────────────────────────────────────────────────────

  async cancel(id: string, orgUserId: string, orgId: string, businessRole: string) {
    const visit = await this.prisma.visit.findFirst({ where: { id, organizationId: orgId } });
    if (!visit) throw new NotFoundException('Visite introuvable');

    if ((visit.status as any) === 'COMPLETED') {
      throw new BadRequestException('Une visite complétée ne peut pas être annulée');
    }
    if (visit.status === 'CANCELLED') {
      throw new BadRequestException('Cette visite est déjà annulée');
    }

    if (businessRole === 'DELEGATE' && visit.delegateId !== orgUserId) {
      throw new ForbiddenException('Vous ne pouvez annuler que vos propres visites');
    }
    if (businessRole === 'DSM') {
      // DSM can cancel their own visits, or (as manager) their team's visits
      if (visit.delegateId !== orgUserId) {
        await this._assertDelegateInDsmTeam(orgUserId, visit.delegateId);
      }
    }
    if (businessRole === 'NSM' || businessRole === 'ASSISTANT') {
      throw new ForbiddenException('Vous ne pouvez pas annuler de visites');
    }

    return this.prisma.visit.update({
      where: { id },
      data: { status: 'CANCELLED', updatedAt: new Date() },
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
    if (businessRole === 'NSM') {
      throw new ForbiddenException('Le NSM ne peut pas supprimer de visites');
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

  /** Team-based lookup — consistent with doctors/products services */
  private async _getDsmTeamDelegateIdsByTeam(dsmOrgUserId: string, orgId: string): Promise<string[]> {
    const managedTeams = await this.prisma.team.findMany({
      where: { organizationId: orgId, managerId: dsmOrgUserId },
      select: { id: true },
    });
    const teamIds = managedTeams.map((t) => t.id);
    const delegates = await this.prisma.organizationUser.findMany({
      where: { teamId: { in: teamIds }, businessRole: 'DELEGATE', isActive: true },
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

  private async _getStockAlerts(orgId: string) {
    // Prisma can't compare two columns directly in WHERE, so we filter in JS
    const items = await this.prisma.promotionalItem.findMany({
      where: { organizationId: orgId },
      select: { id: true, name: true, type: true, totalStock: true, minStockLevel: true } as any,
    });
    return (items as any[])
      .filter((item: any) => item.minStockLevel > 0 && item.totalStock <= item.minStockLevel)
      .map((item: any) => ({ ...item, isZero: item.totalStock === 0 }));
  }
}
