import { PlatformBillingService, CreatePlanDto, UpdatePlanDto, UpdateInvoiceDto } from './platform-billing.service';
export declare class PlatformBillingController {
    private service;
    constructor(service: PlatformBillingService);
    findAllPlans(): Promise<({
        _count: {
            OrganizationSubscription: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        price: number;
        interval: import(".prisma/client").$Enums.BillingInterval;
        maxUsers: number;
        maxDoctors: number;
        features: string[];
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    createPlan(dto: CreatePlanDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        price: number;
        interval: import(".prisma/client").$Enums.BillingInterval;
        maxUsers: number;
        maxDoctors: number;
        features: string[];
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updatePlan(id: string, dto: UpdatePlanDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        price: number;
        interval: import(".prisma/client").$Enums.BillingInterval;
        maxUsers: number;
        maxDoctors: number;
        features: string[];
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAllSubscriptions(status?: string): Promise<({
        Organization: {
            id: string;
            name: string;
            isActive: boolean;
        };
        Plan: {
            id: string;
            name: string;
            price: number;
            interval: import(".prisma/client").$Enums.BillingInterval;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        planId: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        startDate: Date;
        endDate: Date | null;
        trialEndsAt: Date | null;
    })[]>;
    findAllInvoices(status?: string, organizationId?: string): Promise<({
        Organization: {
            id: string;
            name: string;
        };
        Subscription: {
            Plan: {
                name: string;
            };
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        subscriptionId: string;
        amount: number;
        currency: string;
        dueDate: Date;
        paidAt: Date | null;
        notes: string | null;
    })[]>;
    updateInvoice(id: string, dto: UpdateInvoiceDto): Promise<{
        Organization: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        subscriptionId: string;
        amount: number;
        currency: string;
        dueDate: Date;
        paidAt: Date | null;
        notes: string | null;
    }>;
    revenueAnalytics(): Promise<{
        organizationId: string;
        organizationName: string;
        totalRevenue: number;
        invoiceCount: number;
    }[]>;
}
