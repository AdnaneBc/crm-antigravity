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
exports.PlatformBillingController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const platform_admin_guard_1 = require("./platform-admin.guard");
const platform_billing_service_1 = require("./platform-billing.service");
let PlatformBillingController = class PlatformBillingController {
    constructor(service) {
        this.service = service;
    }
    findAllPlans() {
        return this.service.findAllPlans();
    }
    createPlan(dto) {
        return this.service.createPlan(dto);
    }
    updatePlan(id, dto) {
        return this.service.updatePlan(id, dto);
    }
    findAllSubscriptions(status) {
        return this.service.findAllSubscriptions(status);
    }
    findAllInvoices(status, organizationId) {
        return this.service.findAllInvoices(status, organizationId);
    }
    updateInvoice(id, dto) {
        return this.service.updateInvoice(id, dto);
    }
    revenueAnalytics() {
        return this.service.revenueAnalytics();
    }
};
exports.PlatformBillingController = PlatformBillingController;
__decorate([
    (0, common_1.Get)('plans'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformBillingController.prototype, "findAllPlans", null);
__decorate([
    (0, common_1.Post)('plans'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [platform_billing_service_1.CreatePlanDto]),
    __metadata("design:returntype", void 0)
], PlatformBillingController.prototype, "createPlan", null);
__decorate([
    (0, common_1.Patch)('plans/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, platform_billing_service_1.UpdatePlanDto]),
    __metadata("design:returntype", void 0)
], PlatformBillingController.prototype, "updatePlan", null);
__decorate([
    (0, common_1.Get)('subscriptions'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlatformBillingController.prototype, "findAllSubscriptions", null);
__decorate([
    (0, common_1.Get)('invoices'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PlatformBillingController.prototype, "findAllInvoices", null);
__decorate([
    (0, common_1.Patch)('invoices/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, platform_billing_service_1.UpdateInvoiceDto]),
    __metadata("design:returntype", void 0)
], PlatformBillingController.prototype, "updateInvoice", null);
__decorate([
    (0, common_1.Get)('revenue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformBillingController.prototype, "revenueAnalytics", null);
exports.PlatformBillingController = PlatformBillingController = __decorate([
    (0, swagger_1.ApiTags)('platform-admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), platform_admin_guard_1.PlatformAdminGuard),
    (0, common_1.Controller)('platform-admin/billing'),
    __metadata("design:paramtypes", [platform_billing_service_1.PlatformBillingService])
], PlatformBillingController);
//# sourceMappingURL=platform-billing.controller.js.map