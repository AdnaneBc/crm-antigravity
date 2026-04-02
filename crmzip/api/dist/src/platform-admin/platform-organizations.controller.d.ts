import { PlatformOrganizationsService, CreateOrganizationDto, UpdateOrganizationDto, AssignSubscriptionDto } from './platform-organizations.service';
export declare class PlatformOrganizationsController {
    private service;
    constructor(service: PlatformOrganizationsService);
    findAll(search?: string, status?: string): Promise<({
        OrganizationSubscription: ({
            Plan: {
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
        })[];
        _count: {
            doctors: number;
            OrganizationUser: number;
            visits: number;
        };
    } & {
        id: string;
        name: string;
        isActive: boolean;
        suspendedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        logoUrl: string | null;
        primaryColor: string | null;
        secondaryColor: string | null;
    })[]>;
    findOne(id: string): Promise<{
        OrganizationSubscription: ({
            Plan: {
                id: string;
                name: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                price: number;
                interval: import(".prisma/client").$Enums.BillingInterval;
                maxUsers: number;
                maxDoctors: number;
                features: string[];
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
        })[];
        Invoice: {
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
        }[];
        _count: {
            doctors: number;
            OrganizationUser: number;
            PromotionalItem: number;
            Team: number;
            visits: number;
        };
    } & {
        id: string;
        name: string;
        isActive: boolean;
        suspendedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        logoUrl: string | null;
        primaryColor: string | null;
        secondaryColor: string | null;
    }>;
    create(dto: CreateOrganizationDto): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        suspendedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        logoUrl: string | null;
        primaryColor: string | null;
        secondaryColor: string | null;
    }>;
    update(id: string, dto: UpdateOrganizationDto): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        suspendedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        logoUrl: string | null;
        primaryColor: string | null;
        secondaryColor: string | null;
    }>;
    activate(id: string): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        suspendedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        logoUrl: string | null;
        primaryColor: string | null;
        secondaryColor: string | null;
    }>;
    suspend(id: string): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        suspendedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        logoUrl: string | null;
        primaryColor: string | null;
        secondaryColor: string | null;
    }>;
    assignSubscription(id: string, dto: AssignSubscriptionDto): Promise<{
        Plan: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number;
            interval: import(".prisma/client").$Enums.BillingInterval;
            maxUsers: number;
            maxDoctors: number;
            features: string[];
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
    }>;
}
