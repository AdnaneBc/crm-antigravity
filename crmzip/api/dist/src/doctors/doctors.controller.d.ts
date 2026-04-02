import { DoctorsService, CreateDoctorDto } from './doctors.service';
export declare class DoctorsController {
    private service;
    constructor(service: DoctorsService);
    findAll(orgId: string, search?: string, type?: string, sectorId?: string): Promise<({
        Sector: {
            id: string;
            name: string;
        };
        _count: {
            visits: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        address: string | null;
        phone: string | null;
        city: string | null;
        gamme: string | null;
        organizationId: string;
        speciality: string | null;
        type: import(".prisma/client").$Enums.DoctorType;
        sectorName: string | null;
        sectorIMS: string | null;
        potential: string | null;
        lap: string | null;
        code: string | null;
        sectorId: string | null;
    })[]>;
    getSectors(orgId: string): Promise<({
        _count: {
            Doctor: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        managerId: string;
    })[]>;
    findOne(id: string, orgId: string): Promise<{
        Sector: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            managerId: string;
        };
        visits: ({
            OrganizationUser: {
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
            VisitDistribution: ({
                PromotionalItem: {
                    name: string;
                    type: import(".prisma/client").$Enums.PromoItemType;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                organizationId: string;
                quantity: number;
                itemId: string;
                visitId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            description: string | null;
            delegateId: string;
            visitedAt: Date;
            status: import(".prisma/client").$Enums.VisitStatus;
            notes: string | null;
            nextVisitDate: Date | null;
            completedAt: Date | null;
            validatedById: string | null;
            validatedAt: Date | null;
            rejectionReason: string | null;
            doctorId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        address: string | null;
        phone: string | null;
        city: string | null;
        gamme: string | null;
        organizationId: string;
        speciality: string | null;
        type: import(".prisma/client").$Enums.DoctorType;
        sectorName: string | null;
        sectorIMS: string | null;
        potential: string | null;
        lap: string | null;
        code: string | null;
        sectorId: string | null;
    }>;
    create(dto: CreateDoctorDto, orgId: string, businessRole: string, organizationRole: string, platformRole: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        address: string | null;
        phone: string | null;
        city: string | null;
        gamme: string | null;
        organizationId: string;
        speciality: string | null;
        type: import(".prisma/client").$Enums.DoctorType;
        sectorName: string | null;
        sectorIMS: string | null;
        potential: string | null;
        lap: string | null;
        code: string | null;
        sectorId: string | null;
    }>;
    update(id: string, dto: Partial<CreateDoctorDto>, businessRole: string, organizationRole: string, platformRole: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        address: string | null;
        phone: string | null;
        city: string | null;
        gamme: string | null;
        organizationId: string;
        speciality: string | null;
        type: import(".prisma/client").$Enums.DoctorType;
        sectorName: string | null;
        sectorIMS: string | null;
        potential: string | null;
        lap: string | null;
        code: string | null;
        sectorId: string | null;
    }>;
    remove(id: string, businessRole: string, organizationRole: string, platformRole: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        address: string | null;
        phone: string | null;
        city: string | null;
        gamme: string | null;
        organizationId: string;
        speciality: string | null;
        type: import(".prisma/client").$Enums.DoctorType;
        sectorName: string | null;
        sectorIMS: string | null;
        potential: string | null;
        lap: string | null;
        code: string | null;
        sectorId: string | null;
    }>;
    private _assertAssistantOrAdmin;
}
