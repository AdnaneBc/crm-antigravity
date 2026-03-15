import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DoctorsModule } from './doctors/doctors.module';
import { VisitsModule } from './visits/visits.module';
import { ProductsModule } from './products/products.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { OrganizationsModule } from './organizations/organizations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    DoctorsModule,
    VisitsModule,
    ProductsModule,
    AnalyticsModule,
    OrganizationsModule,
  ],
})
export class AppModule {}
