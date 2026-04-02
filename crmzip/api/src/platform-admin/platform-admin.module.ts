import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

import { PlatformDashboardController } from './platform-dashboard.controller';
import { PlatformDashboardService } from './platform-dashboard.service';

import { PlatformOrganizationsController } from './platform-organizations.controller';
import { PlatformOrganizationsService } from './platform-organizations.service';

import { PlatformUsersController } from './platform-users.controller';
import { PlatformUsersService } from './platform-users.service';

import { PlatformBillingController } from './platform-billing.controller';
import { PlatformBillingService } from './platform-billing.service';

import { PlatformAnalyticsController } from './platform-analytics.controller';
import { PlatformAnalyticsService } from './platform-analytics.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    PlatformDashboardController,
    PlatformOrganizationsController,
    PlatformUsersController,
    PlatformBillingController,
    PlatformAnalyticsController,
  ],
  providers: [
    PlatformDashboardService,
    PlatformOrganizationsService,
    PlatformUsersService,
    PlatformBillingService,
    PlatformAnalyticsService,
  ],
})
export class PlatformAdminModule {}
