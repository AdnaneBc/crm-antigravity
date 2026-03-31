"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformAdminModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const platform_dashboard_controller_1 = require("./platform-dashboard.controller");
const platform_dashboard_service_1 = require("./platform-dashboard.service");
const platform_organizations_controller_1 = require("./platform-organizations.controller");
const platform_organizations_service_1 = require("./platform-organizations.service");
const platform_users_controller_1 = require("./platform-users.controller");
const platform_users_service_1 = require("./platform-users.service");
const platform_billing_controller_1 = require("./platform-billing.controller");
const platform_billing_service_1 = require("./platform-billing.service");
const platform_analytics_controller_1 = require("./platform-analytics.controller");
const platform_analytics_service_1 = require("./platform-analytics.service");
let PlatformAdminModule = class PlatformAdminModule {
};
exports.PlatformAdminModule = PlatformAdminModule;
exports.PlatformAdminModule = PlatformAdminModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [
            platform_dashboard_controller_1.PlatformDashboardController,
            platform_organizations_controller_1.PlatformOrganizationsController,
            platform_users_controller_1.PlatformUsersController,
            platform_billing_controller_1.PlatformBillingController,
            platform_analytics_controller_1.PlatformAnalyticsController,
        ],
        providers: [
            platform_dashboard_service_1.PlatformDashboardService,
            platform_organizations_service_1.PlatformOrganizationsService,
            platform_users_service_1.PlatformUsersService,
            platform_billing_service_1.PlatformBillingService,
            platform_analytics_service_1.PlatformAnalyticsService,
        ],
    })
], PlatformAdminModule);
//# sourceMappingURL=platform-admin.module.js.map