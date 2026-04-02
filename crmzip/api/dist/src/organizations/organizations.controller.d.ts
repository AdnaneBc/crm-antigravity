import { OrganizationsService, CreateOrganizationDto } from './organizations.service';
export declare class OrganizationsController {
    private service;
    constructor(service: OrganizationsService);
    findAll(): Promise<({
        _count: {
            doctors: number;
            OrganizationUser: number;
            PromotionalItem: number;
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
        Sector: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            managerId: string;
        }[];
        Team: ({
            OrganizationUser_Team_managerIdToOrganizationUser: {
                User: {
                    [x: string]: {
                        id: string;
                        isActive: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                        phone: string | null;
                        organizationRole: import(".prisma/client").$Enums.OrganizationRole;
                        businessRole: import(".prisma/client").$Enums.BusinessRole | null;
                        fullName: string | null;
                        gender: string | null;
                        city: string | null;
                        gamme: string | null;
                        assignedSectors: string[];
                        userId: string;
                        organizationId: string;
                        managerId: string | null;
                        teamId: string | null;
                    }[] | ({
                        id: string;
                        isActive: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                        phone: string | null;
                        organizationRole: import(".prisma/client").$Enums.OrganizationRole;
                        businessRole: import(".prisma/client").$Enums.BusinessRole | null;
                        fullName: string | null;
                        gender: string | null;
                        city: string | null;
                        gamme: string | null;
                        assignedSectors: string[];
                        userId: string;
                        organizationId: string;
                        managerId: string | null;
                        teamId: string | null;
                    } | {
                        id: string;
                        isActive: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                        phone: string | null;
                        organizationRole: import(".prisma/client").$Enums.OrganizationRole;
                        businessRole: import(".prisma/client").$Enums.BusinessRole | null;
                        fullName: string | null;
                        gender: string | null;
                        city: string | null;
                        gamme: string | null;
                        assignedSectors: string[];
                        userId: string;
                        organizationId: string;
                        managerId: string | null;
                        teamId: string | null;
                    })[] | ({
                        id: string;
                        createdAt: Date;
                        userId: string;
                        organizationId: string | null;
                        action: string;
                        resource: string;
                        resourceId: string | null;
                        meta: import("@prisma/client/runtime/library").JsonValue | null;
                    } | {
                        id: string;
                        createdAt: Date;
                        userId: string;
                        organizationId: string | null;
                        action: string;
                        resource: string;
                        resourceId: string | null;
                        meta: import("@prisma/client/runtime/library").JsonValue | null;
                    })[] | {
                        id: string;
                        createdAt: Date;
                        userId: string;
                        organizationId: string | null;
                        action: string;
                        resource: string;
                        resourceId: string | null;
                        meta: import("@prisma/client/runtime/library").JsonValue | null;
                    }[];
                    [x: number]: never;
                    [x: symbol]: never;
                };
            } & {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                phone: string | null;
                organizationRole: import(".prisma/client").$Enums.OrganizationRole;
                businessRole: import(".prisma/client").$Enums.BusinessRole | null;
                fullName: string | null;
                gender: string | null;
                city: string | null;
                gamme: string | null;
                assignedSectors: string[];
                userId: string;
                organizationId: string;
                managerId: string | null;
                teamId: string | null;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            managerId: string;
        })[];
        _count: {
            doctors: number;
            OrganizationUser: number;
            PromotionalItem: number;
            Sector: number;
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
    update(id: string, dto: Partial<CreateOrganizationDto>): Promise<{
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
}
