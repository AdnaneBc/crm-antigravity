import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService, CreateOrganizationDto } from './organizations.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('organizations')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('SUPER_ADMIN' as any)
@Controller('organizations')
export class OrganizationsController {
  constructor(private service: OrganizationsService) {}
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Post() create(@Body() dto: CreateOrganizationDto) { return this.service.create(dto); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: Partial<CreateOrganizationDto>) { return this.service.update(id, dto); }
}
