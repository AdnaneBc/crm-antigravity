import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService, CreatePromoItemDto, AllocateStockDto } from './products.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('promotional-items')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('promotional-items')
export class ProductsController {
  constructor(private service: ProductsService) {}

  // ── Read endpoints — role-scoped ──────────────────────────────────────────

  @Get()
  findAll(
    @CurrentUser('organizationId') orgId: string,
    @CurrentUser('orgUserId') orgUserId: string,
    @CurrentUser('businessRole') businessRole: string,
    @Query('search') search?: string,
    @Query('type') type?: string,
  ) {
    return this.service.findAll(orgId, orgUserId, businessRole, { search, type });
  }

  @Get('my-stock')
  myStock(
    @CurrentUser('orgUserId') orgUserId: string,
    @CurrentUser('organizationId') orgId: string,
  ) {
    return this.service.getDelegateStock(orgUserId, orgId);
  }

  @Get('stock-alerts')
  stockAlerts(@CurrentUser('organizationId') orgId: string) {
    return this.service.getStockAlerts(orgId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser('organizationId') orgId: string,
  ) {
    return this.service.findOne(id, orgId);
  }

  // ── Write endpoints — ASSISTANT / ADMIN / SUPER_ADMIN only ───────────────

  @Post()
  @Roles('ASSISTANT', 'ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  create(
    @Body() dto: CreatePromoItemDto,
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
    @Body() dto: Partial<CreatePromoItemDto>,
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

  /**
   * POST /promotional-items/:id/allocate
   * Injects stock quantity to a specific delegate.
   * Only ASSISTANT / ADMIN can do this.
   */
  @Post(':id/allocate')
  @Roles('ASSISTANT', 'ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  allocate(
    @Param('id') id: string,
    @Body() dto: AllocateStockDto,
    @CurrentUser('organizationId') orgId: string,
    @CurrentUser('businessRole') businessRole: string,
    @CurrentUser('organizationRole') organizationRole: string,
    @CurrentUser('platformRole') platformRole: string,
  ) {
    this._assertAssistantOrAdmin(businessRole, organizationRole, platformRole);
    return this.service.allocateStock(id, dto, orgId);
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
      'Seuls les assistants et administrateurs peuvent gérer les matériaux promotionnels',
    );
  }
}
