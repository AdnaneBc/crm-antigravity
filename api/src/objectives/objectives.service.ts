import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateObjectiveDto {
  @IsString() userId: string;
  @IsNumber() targetVisits: number;
  @IsNumber() targetCoverage: number;
  @IsNumber() targetSamples: number;
  @IsString() period: string;
}

export class UpdateObjectiveProgressDto {
  @IsOptional() @IsNumber() achievedVisits?: number;
}

@Injectable()
export class ObjectivesService {
  constructor(private prisma: PrismaService) {}
  // NOTE: The real DB schema does not have an Objective model – this module is
  // a stub kept for route completeness. Objectives are tracked at the
  // application logic level using visit counts from OrganizationUser.
  async findAll(orgId: string) {
    return [];
  }
  async create(dto: CreateObjectiveDto, orgId: string) {
    return { message: 'Objectives are managed via visit analytics in this version' };
  }
  async updateProgress(id: string, dto: UpdateObjectiveProgressDto) {
    return { message: 'Objectives are managed via visit analytics in this version' };
  }
}
