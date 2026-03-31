import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformAdminGuard } from './platform-admin.guard';
import {
  PlatformOrganizationsService,
  CreateOrganizationDto,
  UpdateOrganizationDto,
  AssignSubscriptionDto,
} from './platform-organizations.service';

@ApiTags('platform-admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PlatformAdminGuard)
@Controller('platform-admin/organizations')
export class PlatformOrganizationsController {
  constructor(private service: PlatformOrganizationsService) {}

  @Get()
  findAll(@Query('search') search?: string, @Query('status') status?: string) {
    return this.service.findAll(search, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateOrganizationDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrganizationDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.service.activate(id);
  }

  @Patch(':id/suspend')
  suspend(@Param('id') id: string) {
    return this.service.suspend(id);
  }

  @Patch(':id/subscription')
  assignSubscription(@Param('id') id: string, @Body() dto: AssignSubscriptionDto) {
    return this.service.assignSubscription(id, dto);
  }
}
