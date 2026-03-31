import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { DoctorType } from '@prisma/client';

export class CreateDoctorDto {
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsOptional() @IsString() speciality?: string;
  @IsEnum(DoctorType) type: DoctorType;
  @IsOptional() @IsString() sectorId?: string;
  // Contact & Location
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() city?: string;
  // Pharma-specific fields
  @IsOptional() @IsString() sectorName?: string;
  @IsOptional() @IsString() sectorIMS?: string;
  @IsOptional() @IsString() gamme?: string;
  @IsOptional() @IsString() potential?: string;
  @IsOptional() @IsString() lap?: string;
  @IsOptional() @IsString() code?: string;
}

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    orgId: string,
    query?: { search?: string; type?: string; sectorId?: string },
  ) {
    const where: any = { organizationId: orgId };
    if (query?.type) where.type = query.type;
    if (query?.sectorId) where.sectorId = query.sectorId;
    if (query?.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { speciality: { contains: query.search, mode: 'insensitive' } },
        { city: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
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

  async findOne(id: string, orgId: string) {
    return this.prisma.doctor.findFirst({
      where: { id, organizationId: orgId },
      include: {
        Sector: true,
        visits: {
          orderBy: { visitedAt: 'desc' },
          take: 20,
          include: {
            OrganizationUser: {
              include: { User: { select: { firstName: true, lastName: true, email: true } as any } },
            },
            VisitDistribution: {
              include: { PromotionalItem: { select: { name: true, type: true } } },
            },
          },
        },
      },
    });
  }

  async create(dto: CreateDoctorDto, orgId: string) {
    return this.prisma.doctor.create({
      data: { ...dto, organizationId: orgId },
    });
  }

  async update(id: string, dto: Partial<CreateDoctorDto>) {
    return this.prisma.doctor.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.prisma.doctor.delete({ where: { id } });
  }

  // ── Sectors ──────────────────────────────────────────────────────────────
  async getSectors(orgId: string) {
    return this.prisma.sector.findMany({
      where: { organizationId: orgId },
      include: { _count: { select: { Doctor: true } } },
    });
  }
}
