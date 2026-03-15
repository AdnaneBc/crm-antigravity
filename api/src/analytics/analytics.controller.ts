import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('analytics')
export class AnalyticsController {
  constructor(private service: AnalyticsService) {}

  @Get('overview')
  overview(@CurrentUser('organizationId') orgId: string) {
    return this.service.overview(orgId);
  }

  @Get('delegates')
  delegates(@CurrentUser('organizationId') orgId: string) {
    return this.service.delegatePerformance(orgId);
  }

  @Get('visits-trend')
  visitsTrend(@CurrentUser('organizationId') orgId: string) {
    return this.service.visitsTrend(orgId);
  }

  @Get('coverage')
  coverage(@CurrentUser('organizationId') orgId: string) {
    return this.service.doctorCoverage(orgId);
  }

  @Get('promo-items')
  promoItems(@CurrentUser('organizationId') orgId: string) {
    return this.service.promoDistributionSummary(orgId);
  }
}
