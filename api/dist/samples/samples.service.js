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
exports.SamplesService = exports.CreateSampleDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const class_validator_1 = require("class-validator");
class CreateSampleDto {
}
exports.CreateSampleDto = CreateSampleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSampleDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSampleDto.prototype, "doctorId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSampleDto.prototype, "quantity", void 0);
let SamplesService = class SamplesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(orgId, userId, role) { return []; }
    async monthlyReport(orgId) { return []; }
    async create(dto, userId, orgId) {
        return { message: 'Use /promotional-items and /visits with distributions instead' };
    }
    async remove(id) { return { message: 'Not implemented' }; }
};
exports.SamplesService = SamplesService;
exports.SamplesService = SamplesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SamplesService);
//# sourceMappingURL=samples.service.js.map