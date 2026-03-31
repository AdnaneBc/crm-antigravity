import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformAdminGuard } from './platform-admin.guard';
import {
  PlatformUsersService,
  CreatePlatformUserDto,
  UpdatePlatformUserDto,
  AssignOrganizationDto,
  ResetPasswordDto,
} from './platform-users.service';

@ApiTags('platform-admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PlatformAdminGuard)
@Controller('platform-admin/users')
export class PlatformUsersController {
  constructor(private service: PlatformUsersService) {}

  @Get()
  findAll(@Query('search') search?: string) {
    return this.service.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePlatformUserDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlatformUserDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.service.deactivate(id);
  }

  @Post(':id/reset-password')
  resetPassword(@Param('id') id: string, @Body() dto: ResetPasswordDto) {
    return this.service.resetPassword(id, dto);
  }

  @Post(':id/assign-organization')
  assignOrganization(@Param('id') id: string, @Body() dto: AssignOrganizationDto) {
    return this.service.assignOrganization(id, dto);
  }

  @Delete(':id/revoke-organization/:orgId')
  revokeOrganization(@Param('id') id: string, @Param('orgId') orgId: string) {
    return this.service.revokeOrganization(id, orgId);
  }
}
