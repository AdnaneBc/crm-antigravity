import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    overview(orgId: string): Promise<{
        totalVisits: number;
        visitsThisMonth: number;
        totalDoctors: number;
        distributionsThisMonth: number;
        totalDelegates: number;
    }>;
    delegatePerformance(orgId: string): Promise<{
        id: string;
        name: string;
        team: string;
        totalVisits: number;
    }[]>;
    visitsTrend(orgId: string): Promise<{
        month: string;
        visits: number;
    }[]>;
    doctorCoverage(orgId: string): Promise<{
        type: string;
        doctors: number;
        visited: number;
        coverage: number;
    }[]>;
    promoDistributionSummary(orgId: string): Promise<{
        id: string;
        name: string;
        type: import(".prisma/client").$Enums.PromoItemType;
        totalStock: number;
        totalDistributed: number;
    }[]>;
}
