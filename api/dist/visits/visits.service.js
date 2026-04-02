"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitsService = exports.SubmitReportDto = exports.ReportDistributionItemDto = exports.ValidateVisitDto = exports.UpdateVisitDto = exports.BatchCreateVisitDto = exports.CreateVisitDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateVisitDto {
}
exports.CreateVisitDto = CreateVisitDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "doctorId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "visitedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "notes", void 0);
class BatchCreateVisitDto {
}
exports.BatchCreateVisitDto = BatchCreateVisitDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BatchCreateVisitDto.prototype, "doctorIds", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BatchCreateVisitDto.prototype, "visitedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BatchCreateVisitDto.prototype, "notes", void 0);
class UpdateVisitDto {
}
exports.UpdateVisitDto = UpdateVisitDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateVisitDto.prototype, "visitedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVisitDto.prototype, "notes", void 0);
class ValidateVisitDto {
}
exports.ValidateVisitDto = ValidateVisitDto;
__decorate([
    (0, class_validator_1.IsEnum)(['approve', 'reject']),
    __metadata("design:type", String)
], ValidateVisitDto.prototype, "action", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidateVisitDto.prototype, "rejectionReason", void 0);
class ReportDistributionItemDto {
}
exports.ReportDistributionItemDto = ReportDistributionItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportDistributionItemDto.prototype, "itemId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ReportDistributionItemDto.prototype, "quantity", void 0);
class SubmitReportDto {
}
exports.SubmitReportDto = SubmitReportDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitReportDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitReportDto.prototype, "productsPresented", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], SubmitReportDto.prototype, "distributions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SubmitReportDto.prototype, "nextVisitDate", void 0);
let VisitsService = class VisitsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(orgId, orgUserId, businessRole, query) {
        const where = { organizationId: orgId };
        if (businessRole === 'DELEGATE') {
            where.delegateId = orgUserId;
        }
        else if (businessRole === 'DSM') {
            const teamDelegateIds = await this._getDsmTeamDelegateIdsByTeam(orgUserId, orgId);
            where.delegateId = { in: [...teamDelegateIds, orgUserId] };
        }
        if (query?.doctorId)
            where.doctorId = query.doctorId;
        if (query?.delegateId && businessRole !== 'DELEGATE')
            where.delegateId = query.delegateId;
        if (query?.status)
            where.status = query.status;
        if (query?.teamId) {
            const teamMembers = await this.prisma.organizationUser.findMany({
                where: { teamId: query.teamId, isActive: true },
                select: { id: true },
            });
            const memberIds = teamMembers.map((m) => m.id);
            if (where.delegateId?.in) {
                where.delegateId = { in: where.delegateId.in.filter((id) => memberIds.includes(id)) };
            }
            else if (!where.delegateId) {
                where.delegateId = { in: memberIds };
            }
        }
        if (query?.startDate || query?.endDate) {
            where.visitedAt = {};
            if (query.startDate)
                where.visitedAt.gte = new Date(query.startDate);
            if (query.endDate)
                where.visitedAt.lte = new Date(query.endDate);
        }
        return this.prisma.visit.findMany({
            where,
            orderBy: { visitedAt: 'desc' },
            include: {
                doctor: {
                    select: { id: true, firstName: true, lastName: true, speciality: true, type: true },
                },
                OrganizationUser: {
                    include: { User: { select: { firstName: true, lastName: true, email: true } } },
                },
                VisitDistribution: {
                    include: { PromotionalItem: { select: { id: true, name: true, type: true } } },
                },
            },
        });
    }
    async findOne(id, orgId) {
        return this.prisma.visit.findFirst({
            where: { id, organizationId: orgId },
            include: {
                doctor: true,
                OrganizationUser: { include: { User: true } },
                VisitDistribution: { include: { PromotionalItem: true } },
            },
        });
    }
    async getTeamDelegates(orgUserId, orgId) {
        return this.prisma.organizationUser.findMany({
            where: { organizationId: orgId, isActive: true, businessRole: 'DELEGATE', managerId: orgUserId },
            select: {
                id: true,
                businessRole: true,
                User: { select: { firstName: true, lastName: true, email: true } },
                Team_OrganizationUser_teamIdToTeam: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async getPendingValidationCount(orgUserId, orgId, businessRole) {
        if (businessRole !== 'DSM')
            return { count: 0 };
        const delegateIds = await this._getDsmTeamDelegateIds(orgUserId);
        const count = await this.prisma.visit.count({
            where: {
                organizationId: orgId,
                status: 'PENDING_VALIDATION',
                delegateId: { in: delegateIds },
            },
        });
        return { count };
    }
    async create(dto, orgUserId, orgId, businessRole) {
        if (businessRole === 'NSM') {
            throw new common_1.ForbiddenException('Le NSM ne peut pas planifier de visites');
        }
        if (businessRole === 'ASSISTANT') {
            throw new common_1.ForbiddenException("L'assistant ne peut pas planifier de visites");
        }
        const status = businessRole === 'DSM' ? 'APPROVED' : 'PENDING_VALIDATION';
        return this.prisma.visit.create({
            data: {
                organizationId: orgId,
                delegateId: orgUserId,
                doctorId: dto.doctorId,
                visitedAt: new Date(dto.visitedAt),
                status: status,
                notes: dto.notes,
                ...(businessRole === 'DSM' ? { validatedById: orgUserId, validatedAt: new Date() } : {}),
                updatedAt: new Date(),
            },
            include: {
                doctor: { select: { firstName: true, lastName: true } },
                OrganizationUser: { include: { User: { select: { firstName: true, lastName: true } } } },
            },
        });
    }
    async createBatch(dto, orgUserId, orgId, businessRole) {
        if (businessRole === 'NSM') {
            throw new common_1.ForbiddenException('Le NSM ne peut pas planifier de visites');
        }
        if (businessRole === 'ASSISTANT') {
            throw new common_1.ForbiddenException("L'assistant ne peut pas planifier de visites");
        }
        if (!dto.doctorIds?.length) {
            throw new common_1.BadRequestException('Vous devez sélectionner au moins un médecin');
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
                    status: status,
                    notes: dto.notes,
                    ...(businessRole === 'DSM' ? { validatedById: orgUserId, validatedAt: new Date() } : {}),
                    updatedAt: new Date(),
                },
                include: {
                    doctor: { select: { firstName: true, lastName: true } },
                    OrganizationUser: { include: { User: { select: { firstName: true, lastName: true } } } },
                },
            });
            created.push(visit);
        }
        return created;
    }
    async validate(id, dto, orgUserId, orgId, businessRole) {
        if (businessRole !== 'DSM') {
            throw new common_1.ForbiddenException('Seul un DSM peut valider ou rejeter une visite');
        }
        const visit = await this.prisma.visit.findFirst({ where: { id, organizationId: orgId } });
        if (!visit)
            throw new common_1.NotFoundException('Visite introuvable');
        if (visit.status !== 'PENDING_VALIDATION') {
            throw new common_1.BadRequestException(`Impossible de valider une visite avec le statut "${visit.status}"`);
        }
        if (visit.delegateId !== orgUserId) {
            await this._assertDelegateInDsmTeam(orgUserId, visit.delegateId);
        }
        const newStatus = dto.action === 'approve' ? 'APPROVED' : 'REJECTED';
        return this.prisma.visit.update({
            where: { id },
            data: {
                status: newStatus,
                validatedById: orgUserId,
                validatedAt: new Date(),
                rejectionReason: dto.action === 'reject' ? (dto.rejectionReason ?? null) : null,
                updatedAt: new Date(),
            },
            include: {
                doctor: { select: { firstName: true, lastName: true } },
                OrganizationUser: { include: { User: { select: { firstName: true, lastName: true } } } },
            },
        });
    }
    async submitReport(id, dto, orgUserId, orgId, businessRole) {
        if (businessRole === 'NSM') {
            throw new common_1.ForbiddenException('Le NSM ne peut pas soumettre de rapport');
        }
        if (businessRole === 'ASSISTANT') {
            throw new common_1.ForbiddenException("L'assistant ne peut pas soumettre de rapport");
        }
        const visit = await this.prisma.visit.findFirst({ where: { id, organizationId: orgId } });
        if (!visit)
            throw new common_1.NotFoundException('Visite introuvable');
        if (visit.status === 'COMPLETED') {
            throw new common_1.ConflictException('Un rapport a déjà été soumis pour cette visite');
        }
        if (visit.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Impossible de rapporter une visite annulée');
        }
        if (visit.status === 'REJECTED') {
            throw new common_1.BadRequestException('Impossible de rapporter une visite rejetée');
        }
        if (visit.status === 'PENDING_VALIDATION') {
            throw new common_1.BadRequestException('Cette visite est en attente de validation. Elle doit être approuvée avant de soumettre un rapport.');
        }
        if (businessRole === 'DELEGATE' && visit.delegateId !== orgUserId) {
            throw new common_1.ForbiddenException('Vous ne pouvez soumettre un rapport que pour vos propres visites');
        }
        if (businessRole === 'DSM' && visit.delegateId !== orgUserId) {
            throw new common_1.ForbiddenException('Le DSM ne peut soumettre un rapport que pour ses propres visites');
        }
        const distributions = dto.distributions?.filter((d) => d.quantity > 0) ?? [];
        for (const d of distributions) {
            const stock = await this.prisma.stockAllocation.findFirst({
                where: { delegateId: visit.delegateId, itemId: d.itemId },
            });
            if (!stock || stock.quantity < d.quantity) {
                const item = await this.prisma.promotionalItem.findUnique({ where: { id: d.itemId } });
                throw new common_1.BadRequestException(`Stock insuffisant pour "${item?.name ?? d.itemId}": disponible ${stock?.quantity ?? 0}, demandé ${d.quantity}`);
            }
        }
        const result = await this.prisma.$transaction(async (tx) => {
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
                    OrganizationUser: { include: { User: { select: { firstName: true, lastName: true } } } },
                    VisitDistribution: { include: { PromotionalItem: true } },
                },
            });
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
        const alerts = await this._getStockAlerts(orgId);
        return { ...result, stockAlerts: alerts };
    }
    async update(id, dto, orgUserId, orgId, businessRole) {
        const visit = await this.prisma.visit.findFirst({ where: { id, organizationId: orgId } });
        if (!visit)
            throw new common_1.NotFoundException('Visite introuvable');
        if (visit.status === 'COMPLETED') {
            throw new common_1.BadRequestException('Une visite complétée ne peut plus être modifiée');
        }
        if (visit.status === 'REJECTED' || visit.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Cette visite ne peut plus être modifiée');
        }
        if (businessRole === 'DELEGATE' && visit.delegateId !== orgUserId) {
            throw new common_1.ForbiddenException('Vous ne pouvez modifier que vos propres visites');
        }
        if (businessRole === 'DSM' && visit.delegateId !== orgUserId) {
            throw new common_1.ForbiddenException('Le DSM ne peut modifier que ses propres visites planifiées');
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
    async cancel(id, orgUserId, orgId, businessRole) {
        const visit = await this.prisma.visit.findFirst({ where: { id, organizationId: orgId } });
        if (!visit)
            throw new common_1.NotFoundException('Visite introuvable');
        if (visit.status === 'COMPLETED') {
            throw new common_1.BadRequestException('Une visite complétée ne peut pas être annulée');
        }
        if (visit.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Cette visite est déjà annulée');
        }
        if (businessRole === 'DELEGATE' && visit.delegateId !== orgUserId) {
            throw new common_1.ForbiddenException('Vous ne pouvez annuler que vos propres visites');
        }
        if (businessRole === 'DSM') {
            if (visit.delegateId !== orgUserId) {
                await this._assertDelegateInDsmTeam(orgUserId, visit.delegateId);
            }
        }
        if (businessRole === 'NSM' || businessRole === 'ASSISTANT') {
            throw new common_1.ForbiddenException('Vous ne pouvez pas annuler de visites');
        }
        return this.prisma.visit.update({
            where: { id },
            data: { status: 'CANCELLED', updatedAt: new Date() },
        });
    }
    async remove(id, orgUserId, orgId, businessRole) {
        const visit = await this.prisma.visit.findFirst({ where: { id, organizationId: orgId } });
        if (!visit)
            throw new common_1.NotFoundException('Visite introuvable');
        if (businessRole === 'DELEGATE' && visit.delegateId !== orgUserId) {
            throw new common_1.ForbiddenException('Vous ne pouvez supprimer que vos propres visites');
        }
        if (businessRole === 'DSM' && visit.delegateId !== orgUserId) {
            await this._assertDelegateInDsmTeam(orgUserId, visit.delegateId);
        }
        if (businessRole === 'NSM') {
            throw new common_1.ForbiddenException('Le NSM ne peut pas supprimer de visites');
        }
        await this.prisma.visitDistribution.deleteMany({ where: { visitId: id } });
        return this.prisma.visit.delete({ where: { id } });
    }
    async _getDsmTeamDelegateIds(dsmOrgUserId) {
        const delegates = await this.prisma.organizationUser.findMany({
            where: { managerId: dsmOrgUserId, businessRole: 'DELEGATE', isActive: true },
            select: { id: true },
        });
        return delegates.map((d) => d.id);
    }
    async _getDsmTeamDelegateIdsByTeam(dsmOrgUserId, orgId) {
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
    async _assertDelegateInDsmTeam(dsmOrgUserId, targetDelegateId) {
        const delegate = await this.prisma.organizationUser.findFirst({
            where: { id: targetDelegateId, managerId: dsmOrgUserId, businessRole: 'DELEGATE', isActive: true },
        });
        if (!delegate) {
            throw new common_1.ForbiddenException('Ce délégué ne fait pas partie de votre équipe');
        }
    }
    async _getStockAlerts(orgId) {
        const items = await this.prisma.promotionalItem.findMany({
            where: { organizationId: orgId },
            select: { id: true, name: true, type: true, totalStock: true, minStockLevel: true },
        });
        return items
            .filter((item) => item.minStockLevel > 0 && item.totalStock <= item.minStockLevel)
            .map((item) => ({ ...item, isZero: item.totalStock === 0 }));
    }
};
exports.VisitsService = VisitsService;
exports.VisitsService = VisitsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VisitsService);
//# sourceMappingURL=visits.service.js.map