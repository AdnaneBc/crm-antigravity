import { PrismaService } from '../prisma/prisma.service';
import { PromoItemType } from '@prisma/client';
export declare class CreatePromoItemDto {
    name: string;
    type: PromoItemType;
    totalStock: number;
    minStockLevel?: number;
}
export declare class AllocateStockDto {
    delegateId: string;
    quantity: number;
}
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(orgId: string): Promise<any>;
    findOne(id: string, orgId: string): Promise<any>;
    create(dto: CreatePromoItemDto, orgId: string): Promise<any>;
    update(id: string, dto: Partial<CreatePromoItemDto>): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        gamme: string | null;
        organizationId: string;
        type: import(".prisma/client").$Enums.PromoItemType;
        description: string | null;
        totalStock: number;
        minStockLevel: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        gamme: string | null;
        organizationId: string;
        type: import(".prisma/client").$Enums.PromoItemType;
        description: string | null;
        totalStock: number;
        minStockLevel: number;
    }>;
    allocateStock(itemId: string, dto: AllocateStockDto, orgId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        quantity: number;
        itemId: string;
        delegateId: string;
    }>;
    getDelegateStock(orgUserId: string, orgId: string): Promise<any>;
    getStockAlerts(orgId: string): Promise<{
        id: any;
        name: any;
        type: any;
        totalStock: any;
        minStockLevel: any;
        isZero: boolean;
    }[]>;
}
