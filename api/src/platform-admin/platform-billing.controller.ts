import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformAdminGuard } from './platform-admin.guard';
import {
  PlatformBillingService,
  CreatePlanDto,
  UpdatePlanDto,
  UpdateInvoiceDto,
} from './platform-billing.service';

@ApiTags('platform-admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PlatformAdminGuard)
@Controller('platform-admin/billing')
export class PlatformBillingController {
  constructor(private service: PlatformBillingService) {}

  // Plans
  @Get('plans')
  findAllPlans() {
    return this.service.findAllPlans();
  }

  @Post('plans')
  createPlan(@Body() dto: CreatePlanDto) {
    return this.service.createPlan(dto);
  }

  @Patch('plans/:id')
  updatePlan(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.service.updatePlan(id, dto);
  }

  // Subscriptions
  @Get('subscriptions')
  findAllSubscriptions(@Query('status') status?: string) {
    return this.service.findAllSubscriptions(status);
  }

  // Invoices
  @Get('invoices')
  findAllInvoices(
    @Query('status') status?: string,
    @Query('organizationId') organizationId?: string,
  ) {
    return this.service.findAllInvoices(status, organizationId);
  }

  @Patch('invoices/:id')
  updateInvoice(@Param('id') id: string, @Body() dto: UpdateInvoiceDto) {
    return this.service.updateInvoice(id, dto);
  }

  // Revenue
  @Get('revenue')
  revenueAnalytics() {
    return this.service.revenueAnalytics();
  }
}
