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
exports.ProductsService = exports.AllocateStockDto = exports.CreatePromoItemDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class CreatePromoItemDto {
}
exports.CreatePromoItemDto = CreatePromoItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePromoItemDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.PromoItemType),
    __metadata("design:type", String)
], CreatePromoItemDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreatePromoItemDto.prototype, "totalStock", void 0);
class AllocateStockDto {
}
exports.AllocateStockDto = AllocateStockDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AllocateStockDto.prototype, "delegateId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AllocateStockDto.prototype, "quantity", void 0);
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(orgId) {
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
    async findOne(id, orgId) {
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
    async create(dto, orgId) {
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
    async update(id, dto) {
        return this.prisma.promotionalItem.update({
            where: { id },
            data: { ...dto, updatedAt: new Date() },
        });
    }
    async remove(id) {
        return this.prisma.promotionalItem.delete({ where: { id } });
    }
    async allocateStock(itemId, dto, orgId) {
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
    async getDelegateStock(orgUserId, orgId) {
        return this.prisma.stockAllocation.findMany({
            where: { delegateId: orgUserId, organizationId: orgId },
            include: {
                PromotionalItem: { select: { name: true, type: true } },
            },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map