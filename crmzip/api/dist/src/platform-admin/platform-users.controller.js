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
exports.PlatformUsersController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const platform_admin_guard_1 = require("./platform-admin.guard");
const platform_users_service_1 = require("./platform-users.service");
let PlatformUsersController = class PlatformUsersController {
    constructor(service) {
        this.service = service;
    }
    findAll(search) {
        return this.service.findAll(search);
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
    deactivate(id) {
        return this.service.deactivate(id);
    }
    resetPassword(id, dto) {
        return this.service.resetPassword(id, dto);
    }
    assignOrganization(id, dto) {
        return this.service.assignOrganization(id, dto);
    }
    revokeOrganization(id, orgId) {
        return this.service.revokeOrganization(id, orgId);
    }
};
exports.PlatformUsersController = PlatformUsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlatformUsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlatformUsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [platform_users_service_1.CreatePlatformUserDto]),
    __metadata("design:returntype", void 0)
], PlatformUsersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, platform_users_service_1.UpdatePlatformUserDto]),
    __metadata("design:returntype", void 0)
], PlatformUsersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlatformUsersController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Post)(':id/reset-password'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, platform_users_service_1.ResetPasswordDto]),
    __metadata("design:returntype", void 0)
], PlatformUsersController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)(':id/assign-organization'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, platform_users_service_1.AssignOrganizationDto]),
    __metadata("design:returntype", void 0)
], PlatformUsersController.prototype, "assignOrganization", null);
__decorate([
    (0, common_1.Delete)(':id/revoke-organization/:orgId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('orgId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PlatformUsersController.prototype, "revokeOrganization", null);
exports.PlatformUsersController = PlatformUsersController = __decorate([
    (0, swagger_1.ApiTags)('platform-admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), platform_admin_guard_1.PlatformAdminGuard),
    (0, common_1.Controller)('platform-admin/users'),
    __metadata("design:paramtypes", [platform_users_service_1.PlatformUsersService])
], PlatformUsersController);
//# sourceMappingURL=platform-users.controller.js.map