import { PrismaService } from '../prisma/prisma.service';
import { PromoItemType } from '@prisma/client';
export declare class CreatePromoItemDto {
    name: string;
    type: PromoItemType;
    totalStock: number;
}
export declare class AllocateStockDto {
    delegateId: string;
    quantity: number;
}
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(orgId: string): Promise<({
        _count: {
            StockAllocation: number;
            VisitDistribution: number;
        };
        StockAllocation: ({
            OrganizationUser: {
                User: {
                    name: string;
                };
            } & {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                organizationId: string;
                organizationRole: import(".prisma/client").$Enums.OrganizationRole;
                businessRole: import(".prisma/client").$Enums.BusinessRole | null;
                managerId: string | null;
                teamId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            delegateId: string;
            itemId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        type: import(".prisma/client").$Enums.PromoItemType;
        totalStock: number;
    })[]>;
    findOne(id: string, orgId: string): Promise<{
        StockAllocation: ({
            OrganizationUser: {
                User: {
                    name: string;
                };
            } & {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                organizationId: string;
                organizationRole: import(".prisma/client").$Enums.OrganizationRole;
                businessRole: import(".prisma/client").$Enums.BusinessRole | null;
                managerId: string | null;
                teamId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            delegateId: string;
            itemId: string;
            quantity: number;
        })[];
        VisitDistribution: ({
            Visit: {
                doctor: {
                    firstName: string;
                    lastName: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                organizationId: string;
                description: string | null;
                visitedAt: Date;
                doctorId: string;
                delegateId: string;
                status: import(".prisma/client").$Enums.VisitStatus;
                notes: string | null;
                nextVisitDate: Date | null;
                completedAt: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            visitId: string;
            itemId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        type: import(".prisma/client").$Enums.PromoItemType;
        totalStock: number;
    }>;
    create(dto: CreatePromoItemDto, orgId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        type: import(".prisma/client").$Enums.PromoItemType;
        totalStock: number;
    }>;
    update(id: string, dto: Partial<CreatePromoItemDto>): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        type: import(".prisma/client").$Enums.PromoItemType;
        totalStock: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        type: import(".prisma/client").$Enums.PromoItemType;
        totalStock: number;
    }>;
    allocateStock(itemId: string, dto: AllocateStockDto, orgId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        delegateId: string;
        itemId: string;
        quantity: number;
    }>;
    getDelegateStock(orgUserId: string, orgId: string): Promise<({
        PromotionalItem: {
            name: string;
            type: import(".prisma/client").$Enums.PromoItemType;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        delegateId: string;
        itemId: string;
        quantity: number;
    })[]>;
}
