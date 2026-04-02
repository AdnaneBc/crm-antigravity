import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformAdminGuard } from './platform-admin.guard';
import { PlatformAnalyticsService } from './platform-analytics.service';

@ApiTags('platform-admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PlatformAdminGuard)
@Controller('platform-admin/analytics')
export class PlatformAnalyticsController {
  constructor(private service: PlatformAnalyticsService) {}

  @Get('revenue-trend')
  revenueTrend() {
    return this.service.revenueTrend();
  }

  @Get('org-growth')
  orgGrowth() {
    return this.service.orgGrowth();
  }

  @Get('user-growth')
  userGrowth() {
    return this.service.userGrowth();
  }

  @Get('active-orgs')
  activeOrgs() {
    return this.service.activeOrgsOverTime();
  }
}
