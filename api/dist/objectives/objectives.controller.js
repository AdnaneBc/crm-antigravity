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
exports.ObjectivesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const objectives_service_1 = require("./objectives.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let ObjectivesController = class ObjectivesController {
    constructor(service) {
        this.service = service;
    }
    findAll(orgId) { return this.service.findAll(orgId); }
    create(dto, orgId) { return this.service.create(dto, orgId); }
    updateProgress(id, dto) { return this.service.updateProgress(id, dto); }
};
exports.ObjectivesController = ObjectivesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ObjectivesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [objectives_service_1.CreateObjectiveDto, String]),
    __metadata("design:returntype", void 0)
], ObjectivesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/progress'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, objectives_service_1.UpdateObjectiveProgressDto]),
    __metadata("design:returntype", void 0)
], ObjectivesController.prototype, "updateProgress", null);
exports.ObjectivesController = ObjectivesController = __decorate([
    (0, swagger_1.ApiTags)('objectives'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('objectives'),
    __metadata("design:paramtypes", [objectives_service_1.ObjectivesService])
], ObjectivesController);
//# sourceMappingURL=objectives.controller.js.map