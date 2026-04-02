import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DoctorsService, CreateDoctorDto } from './doctors.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('doctors')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('doctors')
export class DoctorsController {
  constructor(private service: DoctorsService) {}

  // ── Read endpoints — all authenticated roles ──────────────────────────────

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

  // ── Write endpoints — ASSISTANT / ADMIN / SUPER_ADMIN only ───────────────

  @Post()
  @Roles('ASSISTANT', 'ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  create(
    @Body() dto: CreateDoctorDto,
    @CurrentUser('organizationId') orgId: string,
    @CurrentUser('businessRole') businessRole: string,
    @CurrentUser('organizationRole') organizationRole: string,
    @CurrentUser('platformRole') platformRole: string,
  ) {
    this._assertAssistantOrAdmin(businessRole, organizationRole, platformRole);
    return this.service.create(dto, orgId);
  }

  @Patch(':id')
  @Roles('ASSISTANT', 'ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateDoctorDto>,
    @CurrentUser('businessRole') businessRole: string,
    @CurrentUser('organizationRole') organizationRole: string,
    @CurrentUser('platformRole') platformRole: string,
  ) {
    this._assertAssistantOrAdmin(businessRole, organizationRole, platformRole);
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ASSISTANT', 'ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  remove(
    @Param('id') id: string,
    @CurrentUser('businessRole') businessRole: string,
    @CurrentUser('organizationRole') organizationRole: string,
    @CurrentUser('platformRole') platformRole: string,
  ) {
    this._assertAssistantOrAdmin(businessRole, organizationRole, platformRole);
    return this.service.remove(id);
  }

  // ── Private ───────────────────────────────────────────────────────────────

  private _assertAssistantOrAdmin(
    businessRole: string,
    organizationRole: string,
    platformRole: string,
  ) {
    if (
      platformRole === 'SUPER_ADMIN' ||
      businessRole === 'ASSISTANT' ||
      organizationRole === 'ADMIN'
    ) return;
    throw new ForbiddenException(
      'Seuls les assistants et administrateurs peuvent gérer les médecins',
    );
  }
}
