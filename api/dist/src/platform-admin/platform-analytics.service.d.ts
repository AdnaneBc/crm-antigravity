import { PrismaService } from '../prisma/prisma.service';
export declare class PlatformAnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    revenueTrend(): Promise<{
        month: string;
        revenue: number;
    }[]>;
    orgGrowth(): Promise<{
        month: string;
        newOrganizations: number;
        cumulative: number;
    }[]>;
    userGrowth(): Promise<{
        month: string;
        newUsers: number;
        cumulative: number;
    }[]>;
    activeOrgsOverTime(): Promise<{
        current: {
            active: number;
            suspended: number;
        };
        trend: {
            month: string;
            suspensions: number;
        }[];
    }>;
}
