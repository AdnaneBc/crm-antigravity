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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const products_service_1 = require("./products.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
let ProductsController = class ProductsController {
    constructor(service) {
        this.service = service;
    }
    findAll(orgId) {
        return this.service.findAll(orgId);
    }
    myStock(orgUserId, orgId) {
        return this.service.getDelegateStock(orgUserId, orgId);
    }
    stockAlerts(orgId) {
        return this.service.getStockAlerts(orgId);
    }
    findOne(id, orgId) {
        return this.service.findOne(id, orgId);
    }
    create(dto, orgId, businessRole, organizationRole, platformRole) {
        this._assertAssistantOrAdmin(businessRole, organizationRole, platformRole);
        return this.service.create(dto, orgId);
    }
    update(id, dto, businessRole, organizationRole, platformRole) {
        this._assertAssistantOrAdmin(businessRole, organizationRole, platformRole);
        return this.service.update(id, dto);
    }
    remove(id, businessRole, organizationRole, platformRole) {
        this._assertAssistantOrAdmin(businessRole, organizationRole, platformRole);
        return this.service.remove(id);
    }
    allocate(id, dto, orgId, businessRole, organizationRole, platformRole) {
        this._assertAssistantOrAdmin(businessRole, organizationRole, platformRole);
        return this.service.allocateStock(id, dto, orgId);
    }
    _assertAssistantOrAdmin(businessRole, organizationRole, platformRole) {
        if (platformRole === 'SUPER_ADMIN' ||
            businessRole === 'ASSISTANT' ||
            organizationRole === 'ADMIN')
            return;
        throw new common_1.ForbiddenException('Seuls les assistants et administrateurs peuvent gérer les matériaux promotionnels');
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-stock'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('orgUserId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "myStock", null);
__decorate([
    (0, common_1.Get)('stock-alerts'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "stockAlerts", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('ASSISTANT', 'ADMIN', 'SUPER_ADMIN'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('businessRole')),
    __param(3, (0, current_user_decorator_1.CurrentUser)('organizationRole')),
    __param(4, (0, current_user_decorator_1.CurrentUser)('platformRole')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [products_service_1.CreatePromoItemDto, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('ASSISTANT', 'ADMIN', 'SUPER_ADMIN'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('businessRole')),
    __param(3, (0, current_user_decorator_1.CurrentUser)('organizationRole')),
    __param(4, (0, current_user_decorator_1.CurrentUser)('platformRole')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('ASSISTANT', 'ADMIN', 'SUPER_ADMIN'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('businessRole')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('organizationRole')),
    __param(3, (0, current_user_decorator_1.CurrentUser)('platformRole')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/allocate'),
    (0, roles_decorator_1.Roles)('ASSISTANT', 'ADMIN', 'SUPER_ADMIN'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(3, (0, current_user_decorator_1.CurrentUser)('businessRole')),
    __param(4, (0, current_user_decorator_1.CurrentUser)('organizationRole')),
    __param(5, (0, current_user_decorator_1.CurrentUser)('platformRole')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, products_service_1.AllocateStockDto, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "allocate", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('promotional-items'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('promotional-items'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map