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
exports.VisitsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const visits_service_1 = require("./visits.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let VisitsController = class VisitsController {
    constructor(service) {
        this.service = service;
    }
    findAll(orgId, orgUserId, businessRole, query) {
        return this.service.findAll(orgId, orgUserId, businessRole ?? '', query);
    }
    teamDelegates(orgUserId, orgId) {
        return this.service.getTeamDelegates(orgUserId, orgId);
    }
    pendingCount(orgUserId, orgId, businessRole) {
        return this.service.getPendingValidationCount(orgUserId, orgId, businessRole ?? '');
    }
    findOne(id, orgId) {
        return this.service.findOne(id, orgId);
    }
    create(dto, orgUserId, orgId, businessRole) {
        return this.service.create(dto, orgUserId, orgId, businessRole ?? '');
    }
    validate(id, dto, orgUserId, orgId, businessRole) {
        return this.service.validate(id, dto, orgUserId, orgId, businessRole ?? '');
    }
    submitReport(id, dto, orgUserId, orgId, businessRole) {
        return this.service.submitReport(id, dto, orgUserId, orgId, businessRole ?? '');
    }
    update(id, dto, orgUserId, orgId, businessRole) {
        return this.service.update(id, dto, orgUserId, orgId, businessRole ?? '');
    }
    cancel(id, orgUserId, orgId, businessRole) {
        return this.service.cancel(id, orgUserId, orgId, businessRole ?? '');
    }
    remove(id, orgUserId, orgId, businessRole) {
        return this.service.remove(id, orgUserId, orgId, businessRole ?? '');
    }
};
exports.VisitsController = VisitsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('orgUserId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('businessRole')),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('team-delegates'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('orgUserId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "teamDelegates", null);
__decorate([
    (0, common_1.Get)('pending-count'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('orgUserId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('businessRole')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "pendingCount", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('orgUserId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(3, (0, current_user_decorator_1.CurrentUser)('businessRole')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [visits_service_1.CreateVisitDto, String, String, String]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/validate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('orgUserId')),
    __param(3, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(4, (0, current_user_decorator_1.CurrentUser)('businessRole')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, visits_service_1.ValidateVisitDto, String, String, String]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "validate", null);
__decorate([
    (0, common_1.Post)(':id/report'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('orgUserId')),
    __param(3, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(4, (0, current_user_decorator_1.CurrentUser)('businessRole')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, visits_service_1.SubmitReportDto, String, String, String]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "submitReport", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('orgUserId')),
    __param(3, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(4, (0, current_user_decorator_1.CurrentUser)('businessRole')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, visits_service_1.UpdateVisitDto, String, String, String]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('orgUserId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(3, (0, current_user_decorator_1.CurrentUser)('businessRole')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('orgUserId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(3, (0, current_user_decorator_1.CurrentUser)('businessRole')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "remove", null);
exports.VisitsController = VisitsController = __decorate([
    (0, swagger_1.ApiTags)('visits'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('visits'),
    __metadata("design:paramtypes", [visits_service_1.VisitsService])
], VisitsController);
//# sourceMappingURL=visits.controller.js.map