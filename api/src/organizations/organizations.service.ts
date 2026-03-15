import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, IsOptional } from 'class-validator';

export class CreateOrganizationDto {
  @IsString() name: string;
  @IsOptional() @IsString() logoUrl?: string;
  @IsOptional() @IsString() primaryColor?: string;
  @IsOptional() @IsString() secondaryColor?: string;
}

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.organization.findMany({
      include: {
        _count: {
          select: { OrganizationUser: true, doctors: true, visits: true, PromotionalItem: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.organization.findUnique({
      where: { id },
      include: {
        _count: {
          select: { OrganizationUser: true, doctors: true, visits: true, PromotionalItem: true, Team: true, Sector: true },
        },
        Team: { include: { OrganizationUser_Team_managerIdToOrganizationUser: { include: { User: { select: { name: true } } } } } },
        Sector: true,
      },
    });
  }

  async create(dto: CreateOrganizationDto) {
    return this.prisma.organization.create({ data: { ...dto, updatedAt: new Date() } as any });
  }

  async update(id: string, dto: Partial<CreateOrganizationDto>) {
    return this.prisma.organization.update({ where: { id }, data: { ...dto, updatedAt: new Date() } as any });
  }
}
