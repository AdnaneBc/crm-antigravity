import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService, CreateOrgUserDto } from './users.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get()
  findAll(@CurrentUser('organizationId') orgId: string) {
    return this.service.findAll(orgId);
  }

  @Get('teams')
  getTeams(@CurrentUser('organizationId') orgId: string) {
    return this.service.getTeams(orgId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateOrgUserDto, @CurrentUser('organizationId') orgId: string) {
    return this.service.create(dto, orgId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateOrgUserDto>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  deactivate(@Param('id') id: string) {
    return this.service.deactivate(id);
  }
}
