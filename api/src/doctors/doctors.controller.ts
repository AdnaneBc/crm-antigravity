import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DoctorsService, CreateDoctorDto } from './doctors.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('doctors')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('doctors')
export class DoctorsController {
  constructor(private service: DoctorsService) {}

  @Get()
  findAll(
    @CurrentUser('organizationId') orgId: string,
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('sectorId') sectorId?: string,
  ) {
    return this.service.findAll(orgId, { search, type, sectorId });
  }

  @Get('sectors')
  getSectors(@CurrentUser('organizationId') orgId: string) {
    return this.service.getSectors(orgId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('organizationId') orgId: string) {
    return this.service.findOne(id, orgId);
  }

  @Post()
  create(@Body() dto: CreateDoctorDto, @CurrentUser('organizationId') orgId: string) {
    return this.service.create(dto, orgId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateDoctorDto>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
