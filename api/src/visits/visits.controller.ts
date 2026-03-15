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
  SubmitReportDto,
} from './visits.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('visits')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('visits')
export class VisitsController {
  constructor(private service: VisitsService) {}

  @Get()
  findAll(
    @CurrentUser('organizationId') orgId: string,
    @CurrentUser('orgUserId') orgUserId: string,
    @CurrentUser('businessRole') businessRole: string,
    @Query() query: any,
  ) {
    return this.service.findAll(orgId, orgUserId, businessRole ?? '', query);
  }

  /** GET /visits/team-delegates — DSM gets their team's delegates for assignment */
  @Get('team-delegates')
  teamDelegates(
    @CurrentUser('orgUserId') orgUserId: string,
    @CurrentUser('organizationId') orgId: string,
  ) {
    return this.service.getTeamDelegates(orgUserId, orgId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser('organizationId') orgId: string,
  ) {
    return this.service.findOne(id, orgId);
  }

  /** POST /visits — Planning phase only (no distributions) */
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
   * POST /visits/:id/report — Reporting phase
   * Records what happened, distributes promotional items, deducts stock.
   * Only valid when status === PLANNED.
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

  /** PATCH /visits/:id — Update planning fields or cancel */
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
