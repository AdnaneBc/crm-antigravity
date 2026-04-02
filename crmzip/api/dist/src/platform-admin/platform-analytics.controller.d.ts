import { PlatformAnalyticsService } from './platform-analytics.service';
export declare class PlatformAnalyticsController {
    private service;
    constructor(service: PlatformAnalyticsService);
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
    activeOrgs(): Promise<{
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
