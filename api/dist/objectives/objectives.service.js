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
exports.ObjectivesService = exports.UpdateObjectiveProgressDto = exports.CreateObjectiveDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const class_validator_1 = require("class-validator");
class CreateObjectiveDto {
}
exports.CreateObjectiveDto = CreateObjectiveDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateObjectiveDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateObjectiveDto.prototype, "targetVisits", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateObjectiveDto.prototype, "targetCoverage", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateObjectiveDto.prototype, "targetSamples", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateObjectiveDto.prototype, "period", void 0);
class UpdateObjectiveProgressDto {
}
exports.UpdateObjectiveProgressDto = UpdateObjectiveProgressDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateObjectiveProgressDto.prototype, "achievedVisits", void 0);
let ObjectivesService = class ObjectivesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(orgId) {
        return [];
    }
    async create(dto, orgId) {
        return { message: 'Objectives are managed via visit analytics in this version' };
    }
    async updateProgress(id, dto) {
        return { message: 'Objectives are managed via visit analytics in this version' };
    }
};
exports.ObjectivesService = ObjectivesService;
exports.ObjectivesService = ObjectivesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ObjectivesService);
//# sourceMappingURL=objectives.service.js.map