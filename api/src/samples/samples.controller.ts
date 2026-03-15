import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SamplesService, CreateSampleDto } from './samples.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('samples')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('samples')
export class SamplesController {
  constructor(private service: SamplesService) {}
  @Get() findAll(@CurrentUser('organizationId') orgId: string, @CurrentUser('id') userId: string, @CurrentUser('role') role: string) { return this.service.findAll(orgId, userId, role); }
  @Get('monthly-report') monthlyReport(@CurrentUser('organizationId') orgId: string) { return this.service.monthlyReport(orgId); }
  @Post() create(@Body() dto: CreateSampleDto, @CurrentUser('id') userId: string, @CurrentUser('organizationId') orgId: string) { return this.service.create(dto, userId, orgId); }
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
}
