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
exports.PlatformDashboardController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const platform_admin_guard_1 = require("./platform-admin.guard");
const platform_dashboard_service_1 = require("./platform-dashboard.service");
let PlatformDashboardController = class PlatformDashboardController {
    constructor(service) {
        this.service = service;
    }
    getDashboard() {
        return this.service.getDashboard();
    }
};
exports.PlatformDashboardController = PlatformDashboardController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformDashboardController.prototype, "getDashboard", null);
exports.PlatformDashboardController = PlatformDashboardController = __decorate([
    (0, swagger_1.ApiTags)('platform-admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), platform_admin_guard_1.PlatformAdminGuard),
    (0, common_1.Controller)('platform-admin/dashboard'),
    __metadata("design:paramtypes", [platform_dashboard_service_1.PlatformDashboardService])
], PlatformDashboardController);
//# sourceMappingURL=platform-dashboard.controller.js.map