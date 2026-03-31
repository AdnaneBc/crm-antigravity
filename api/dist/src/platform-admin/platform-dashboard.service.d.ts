import { PrismaService } from '../prisma/prisma.service';
export declare class PlatformDashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboard(): Promise<{
        organizations: {
            total: number;
            active: number;
            suspended: number;
        };
        users: {
            total: number;
            active: number;
        };
        revenue: {
            total: number;
            monthly: number;
            currency: string;
        };
        invoices: {
            total: number;
            pending: number;
            overdue: number;
        };
        subscriptions: {
            active: number;
            trial: number;
            suspended: number;
            cancelled: number;
        };
        platformUsage: {
            totalDoctors: number;
            totalVisits: number;
        };
    }>;
}
