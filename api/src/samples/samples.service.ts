import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, IsNumber } from 'class-validator';

export class CreateSampleDto {
  @IsString() productId: string;
  @IsString() doctorId: string;
  @IsNumber() quantity: number;
}

@Injectable()
export class SamplesService {
  constructor(private prisma: PrismaService) {}
  // NOTE: The real DB schema uses PromotionalItem + VisitDistribution instead of Samples.
  // This module is a stub kept for route compatibility.
  async findAll(orgId: string, userId: string, role: string) { return []; }
  async monthlyReport(orgId: string) { return []; }
  async create(dto: CreateSampleDto, userId: string, orgId: string) {
    return { message: 'Use /promotional-items and /visits with distributions instead' };
  }
  async remove(id: string) { return { message: 'Not implemented' }; }
}
