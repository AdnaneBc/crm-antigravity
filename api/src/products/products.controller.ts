import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards, ForbiddenException,
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

  // ── Read endpoints — all authenticated roles ──────────────────────────────

  @Get()
  findAll(@CurrentUser('organizationId') orgId: string) {
    return this.service.findAll(orgId);
  }

  @Get('my-stock')
  myStock(
    @CurrentUser('orgUserId') orgUserId: string,
    @CurrentUser('organizationId') orgId: string,
  ) {
    return this.service.getDelegateStock(orgUserId, orgId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser('organizationId') orgId: string,
  ) {
    return this.service.findOne(id, orgId);
  }

  // ── Write endpoints — NSM / ADMIN / SUPER_ADMIN only ─────────────────────

  @Post()
  @Roles('NSM', 'ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  create(
    @Body() dto: CreatePromoItemDto,
    @CurrentUser('organizationId') orgId: string,
    @CurrentUser('businessRole') businessRole: string,
    @CurrentUser('organizationRole') organizationRole: string,
    @CurrentUser('platformRole') platformRole: string,
  ) {
    this._assertAdminOrNsm(businessRole, organizationRole, platformRole);
    return this.service.create(dto, orgId);
  }

  @Patch(':id')
  @Roles('NSM', 'ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreatePromoItemDto>,
    @CurrentUser('businessRole') businessRole: string,
    @CurrentUser('organizationRole') organizationRole: string,
    @CurrentUser('platformRole') platformRole: string,
  ) {
    this._assertAdminOrNsm(businessRole, organizationRole, platformRole);
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('NSM', 'ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  remove(
    @Param('id') id: string,
    @CurrentUser('businessRole') businessRole: string,
    @CurrentUser('organizationRole') organizationRole: string,
    @CurrentUser('platformRole') platformRole: string,
  ) {
    this._assertAdminOrNsm(businessRole, organizationRole, platformRole);
    return this.service.remove(id);
  }

  /**
   * POST /promotional-items/:id/allocate
   * Allocates stock quantity to a specific delegate.
   * Only NSM / ADMIN can do this.
   */
  @Post(':id/allocate')
  @Roles('NSM', 'ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  allocate(
    @Param('id') id: string,
    @Body() dto: AllocateStockDto,
    @CurrentUser('organizationId') orgId: string,
    @CurrentUser('businessRole') businessRole: string,
    @CurrentUser('organizationRole') organizationRole: string,
    @CurrentUser('platformRole') platformRole: string,
  ) {
    this._assertAdminOrNsm(businessRole, organizationRole, platformRole);
    return this.service.allocateStock(id, dto, orgId);
  }

  // ── Private ───────────────────────────────────────────────────────────────

  private _assertAdminOrNsm(
    businessRole: string,
    organizationRole: string,
    platformRole: string,
  ) {
    const allowed = ['NSM', 'ADMIN', 'SUPER_ADMIN', 'OWNER', 'ADMIN'];
    if (
      platformRole === 'SUPER_ADMIN' ||
      allowed.includes(businessRole) ||
      allowed.includes(organizationRole)
    ) return;
    throw new ForbiddenException(
      'Seuls les managers (NSM) et administrateurs peuvent gérer les matériaux promotionnels',
    );
  }
}
