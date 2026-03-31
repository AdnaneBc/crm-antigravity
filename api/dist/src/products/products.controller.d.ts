import { ProductsService, CreatePromoItemDto, AllocateStockDto } from './products.service';
export declare class ProductsController {
    private service;
    constructor(service: ProductsService);
    findAll(orgId: string): Promise<any>;
    myStock(orgUserId: string, orgId: string): Promise<any>;
    stockAlerts(orgId: string): Promise<{
        id: any;
        name: any;
        type: any;
        totalStock: any;
        minStockLevel: any;
        isZero: boolean;
    }[]>;
    findOne(id: string, orgId: string): Promise<any>;
    create(dto: CreatePromoItemDto, orgId: string, businessRole: string, organizationRole: string, platformRole: string): Promise<any>;
    update(id: string, dto: Partial<CreatePromoItemDto>, businessRole: string, organizationRole: string, platformRole: string): Promise<{
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
    remove(id: string, businessRole: string, organizationRole: string, platformRole: string): Promise<{
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
    allocate(id: string, dto: AllocateStockDto, orgId: string, businessRole: string, organizationRole: string, platformRole: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        quantity: number;
        itemId: string;
        delegateId: string;
    }>;
    private _assertAssistantOrAdmin;
}
