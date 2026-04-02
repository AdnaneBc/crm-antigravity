import { PlatformDashboardService } from './platform-dashboard.service';
export declare class PlatformDashboardController {
    private service;
    constructor(service: PlatformDashboardService);
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
