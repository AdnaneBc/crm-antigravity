import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private service;
    constructor(service: AnalyticsService);
    overview(orgId: string): Promise<{
        totalVisits: number;
        visitsThisMonth: number;
        totalDoctors: number;
        distributionsThisMonth: number;
        totalDelegates: number;
    }>;
    delegates(orgId: string): Promise<any>;
    visitsTrend(orgId: string): Promise<{
        month: string;
        visits: number;
    }[]>;
    coverage(orgId: string): Promise<{
        type: string;
        doctors: number;
        visited: number;
        coverage: number;
    }[]>;
    promoItems(orgId: string): Promise<{
        id: string;
        name: string;
        type: import(".prisma/client").$Enums.PromoItemType;
        totalStock: number;
        totalDistributed: number;
    }[]>;
}
