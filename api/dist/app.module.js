"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const doctors_module_1 = require("./doctors/doctors.module");
const visits_module_1 = require("./visits/visits.module");
const products_module_1 = require("./products/products.module");
const analytics_module_1 = require("./analytics/analytics.module");
const organizations_module_1 = require("./organizations/organizations.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            doctors_module_1.DoctorsModule,
            visits_module_1.VisitsModule,
            products_module_1.ProductsModule,
            analytics_module_1.AnalyticsModule,
            organizations_module_1.OrganizationsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map