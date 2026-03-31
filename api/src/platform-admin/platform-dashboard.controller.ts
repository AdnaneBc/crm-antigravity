import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformAdminGuard } from './platform-admin.guard';
import { PlatformDashboardService } from './platform-dashboard.service';

@ApiTags('platform-admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PlatformAdminGuard)
@Controller('platform-admin/dashboard')
export class PlatformDashboardController {
  constructor(private service: PlatformDashboardService) {}

  @Get()
  getDashboard() {
    return this.service.getDashboard();
  }
}
