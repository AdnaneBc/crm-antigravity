import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  VisitsService,
  CreateVisitDto,
  UpdateVisitDto,
  ValidateVisitDto,
  SubmitReportDto,
} from './visits.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('visits')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('visits')
export class VisitsController {
  constructor(private service: VisitsService) {}

  /** GET /visits — List visits (role-scoped) */
  @Get()
  findAll(
    @CurrentUser('organizationId') orgId: string,
    @CurrentUser('orgUserId') orgUserId: string,
    @CurrentUser('businessRole') businessRole: string,
    @Query() query: any,
  ) {
    return this.service.findAll(orgId, orgUserId, businessRole ?? '', query);
  }

  /** GET /visits/team-delegates — DSM gets their team's delegates */
  @Get('team-delegates')
  teamDelegates(
    @CurrentUser('orgUserId') orgUserId: string,
    @CurrentUser('organizationId') orgId: string,
  ) {
    return this.service.getTeamDelegates(orgUserId, orgId);
  }

  /** GET /visits/pending-count — DSM alert badge count */
  @Get('pending-count')
  pendingCount(
    @CurrentUser('orgUserId') orgUserId: string,
    @CurrentUser('organizationId') orgId: string,
    @CurrentUser('businessRole') businessRole: string,
  ) {
    return this.service.getPendingValidationCount(orgUserId, orgId, businessRole ?? '');
  }

  /** GET /visits/:id */
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser('organizationId') orgId: string,
  ) {
    return this.service.findOne(id, orgId);
  }

  /** POST /visits — Planning phase (status always becomes PENDING_VALIDATION) */
  @Post()
  create(
    @Body() dto: CreateVisitDto,
    @CurrentUser('orgUserId') orgUserId: string,
    @CurrentUser('organizationId') orgId: string,
    @CurrentUser('businessRole') businessRole: string,
  ) {
    return this.service.create(dto, orgUserId, orgId, businessRole ?? '');
  }

  /**
   * PATCH /visits/:id/validate
   * DSM only — approve or reject a delegate's PENDING_VALIDATION visit.
   */
  @Patch(':id/validate')
  validate(
    @Param('id') id: string,
    @Body() dto: ValidateVisitDto,
    @CurrentUser('orgUserId') orgUserId: string,
    @CurrentUser('organizationId') orgId: string,
    @CurrentUser('businessRole') businessRole: string,
  ) {
    return this.service.validate(id, dto, orgUserId, orgId, businessRole ?? '');
  }

  /**
   * POST /visits/:id/report — Reporting phase
   * Only valid when status === APPROVED.
   * Deducts stock and sets status to COMPLETED.
   */
  @Post(':id/report')
  submitReport(
    @Param('id') id: string,
    @Body() dto: SubmitReportDto,
    @CurrentUser('orgUserId') orgUserId: string,
    @CurrentUser('organizationId') orgId: string,
    @CurrentUser('businessRole') businessRole: string,
  ) {
    return this.service.submitReport(id, dto, orgUserId, orgId, businessRole ?? '');
  }

  /** PATCH /visits/:id — Update planning fields (date, notes) */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVisitDto,
    @CurrentUser('orgUserId') orgUserId: string,
    @CurrentUser('organizationId') orgId: string,
    @CurrentUser('businessRole') businessRole: string,
  ) {
    return this.service.update(id, dto, orgUserId, orgId, businessRole ?? '');
  }

  /** PATCH /visits/:id/cancel — Cancel a visit */
  @Patch(':id/cancel')
  cancel(
    @Param('id') id: string,
    @CurrentUser('orgUserId') orgUserId: string,
    @CurrentUser('organizationId') orgId: string,
    @CurrentUser('businessRole') businessRole: string,
  ) {
    return this.service.cancel(id, orgUserId, orgId, businessRole ?? '');
  }

  /** DELETE /visits/:id */
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser('orgUserId') orgUserId: string,
    @CurrentUser('organizationId') orgId: string,
    @CurrentUser('businessRole') businessRole: string,
  ) {
    return this.service.remove(id, orgUserId, orgId, businessRole ?? '');
  }
}
