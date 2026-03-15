import { PrismaService } from '../prisma/prisma.service';
export declare class CreateOrganizationDto {
    name: string;
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
}
export declare class OrganizationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        _count: {
            OrganizationUser: number;
            doctors: number;
            PromotionalItem: number;
            visits: number;
        };
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        logoUrl: string | null;
        primaryColor: string | null;
        secondaryColor: string | null;
    })[]>;
    findOne(id: string): Promise<{
        _count: {
            OrganizationUser: number;
            Sector: number;
            doctors: number;
            PromotionalItem: number;
            Team: number;
            visits: number;
        };
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
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            managerId: string;
        })[];
    } & {
        id: string;
        name: string;
        isActive: boolean;
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
        createdAt: Date;
        updatedAt: Date;
        logoUrl: string | null;
        primaryColor: string | null;
        secondaryColor: string | null;
    }>;
}
