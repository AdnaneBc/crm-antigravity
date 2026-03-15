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
exports.DoctorsService = exports.CreateDoctorDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateDoctorDto {
}
exports.CreateDoctorDto = CreateDoctorDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "speciality", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.DoctorType),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "sectorId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorDto.prototype, "phone", void 0);
let DoctorsService = class DoctorsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(orgId, query) {
        const where = { organizationId: orgId };
        if (query?.type)
            where.type = query.type;
        if (query?.sectorId)
            where.sectorId = query.sectorId;
        if (query?.search) {
            where.OR = [
                { firstName: { contains: query.search, mode: 'insensitive' } },
                { lastName: { contains: query.search, mode: 'insensitive' } },
                { speciality: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.doctor.findMany({
            where,
            orderBy: { lastName: 'asc' },
            include: {
                Sector: { select: { id: true, name: true } },
                _count: { select: { visits: true } },
            },
        });
    }
    async findOne(id, orgId) {
        return this.prisma.doctor.findFirst({
            where: { id, organizationId: orgId },
            include: {
                Sector: true,
                visits: {
                    orderBy: { visitedAt: 'desc' },
                    take: 20,
                    include: {
                        OrganizationUser: {
                            include: { User: { select: { name: true, email: true } } },
                        },
                        VisitDistribution: {
                            include: { PromotionalItem: { select: { name: true, type: true } } },
                        },
                    },
                },
            },
        });
    }
    async create(dto, orgId) {
        return this.prisma.doctor.create({
            data: { ...dto, organizationId: orgId },
        });
    }
    async update(id, dto) {
        return this.prisma.doctor.update({ where: { id }, data: dto });
    }
    async remove(id) {
        return this.prisma.doctor.delete({ where: { id } });
    }
    async getSectors(orgId) {
        return this.prisma.sector.findMany({
            where: { organizationId: orgId },
            include: { _count: { select: { Doctor: true } } },
        });
    }
};
exports.DoctorsService = DoctorsService;
exports.DoctorsService = DoctorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DoctorsService);
//# sourceMappingURL=doctors.service.js.map