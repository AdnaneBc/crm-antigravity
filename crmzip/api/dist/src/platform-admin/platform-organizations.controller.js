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
exports.PlatformOrganizationsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const platform_admin_guard_1 = require("./platform-admin.guard");
const platform_organizations_service_1 = require("./platform-organizations.service");
let PlatformOrganizationsController = class PlatformOrganizationsController {
    constructor(service) {
        this.service = service;
    }
    findAll(search, status) {
        return this.service.findAll(search, status);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    create(dto) {
        return this.service.create(dto);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    activate(id) {
        return this.service.activate(id);
    }
    suspend(id) {
        return this.service.suspend(id);
    }
    assignSubscription(id, dto) {
        return this.service.assignSubscription(id, dto);
    }
};
exports.PlatformOrganizationsController = PlatformOrganizationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PlatformOrganizationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlatformOrganizationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [platform_organizations_service_1.CreateOrganizationDto]),
    __metadata("design:returntype", void 0)
], PlatformOrganizationsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, platform_organizations_service_1.UpdateOrganizationDto]),
    __metadata("design:returntype", void 0)
], PlatformOrganizationsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlatformOrganizationsController.prototype, "activate", null);
__decorate([
    (0, common_1.Patch)(':id/suspend'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlatformOrganizationsController.prototype, "suspend", null);
__decorate([
    (0, common_1.Patch)(':id/subscription'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, platform_organizations_service_1.AssignSubscriptionDto]),
    __metadata("design:returntype", void 0)
], PlatformOrganizationsController.prototype, "assignSubscription", null);
exports.PlatformOrganizationsController = PlatformOrganizationsController = __decorate([
    (0, swagger_1.ApiTags)('platform-admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), platform_admin_guard_1.PlatformAdminGuard),
    (0, common_1.Controller)('platform-admin/organizations'),
    __metadata("design:paramtypes", [platform_organizations_service_1.PlatformOrganizationsService])
], PlatformOrganizationsController);
//# sourceMappingURL=platform-organizations.controller.js.map