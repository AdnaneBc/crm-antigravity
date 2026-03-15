import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ObjectivesService, CreateObjectiveDto, UpdateObjectiveProgressDto } from './objectives.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('objectives')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('objectives')
export class ObjectivesController {
  constructor(private service: ObjectivesService) {}
  @Get() findAll(@CurrentUser('organizationId') orgId: string) { return this.service.findAll(orgId); }
  @Post() create(@Body() dto: CreateObjectiveDto, @CurrentUser('organizationId') orgId: string) { return this.service.create(dto, orgId); }
  @Patch(':id/progress') updateProgress(@Param('id') id: string, @Body() dto: UpdateObjectiveProgressDto) { return this.service.updateProgress(id, dto); }
}
