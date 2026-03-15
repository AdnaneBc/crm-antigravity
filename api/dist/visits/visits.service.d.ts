import { PrismaService } from '../prisma/prisma.service';
import { VisitStatus } from '@prisma/client';
export declare class CreateVisitDto {
    doctorId: string;
    visitedAt: string;
    delegateId?: string;
    notes?: string;
}
export declare class UpdateVisitDto {
    visitedAt?: string;
    notes?: string;
    status?: VisitStatus;
}
export declare class ReportDistributionItemDto {
    itemId: string;
    quantity: number;
}
export declare class SubmitReportDto {
    description?: string;
    productsPresented?: string;
    distributions?: ReportDistributionItemDto[];
    nextVisitDate?: string;
}
export declare class VisitsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(orgId: string, orgUserId: string, businessRole: string, query?: any): Promise<({
        doctor: {
            id: string;
            firstName: string;
            lastName: string;
            speciality: string;
            type: import(".prisma/client").$Enums.DoctorType;
        };
        OrganizationUser: {
            User: {
                email: string;
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
        VisitDistribution: ({
            PromotionalItem: {
                id: string;
                name: string;
                type: import(".prisma/client").$Enums.PromoItemType;
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
    })[]>;
    findOne(id: string, orgId: string): Promise<{
        doctor: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
            phone: string | null;
            organizationId: string;
            firstName: string;
            lastName: string;
            speciality: string | null;
            type: import(".prisma/client").$Enums.DoctorType;
            sectorId: string | null;
        };
        OrganizationUser: {
            User: {
                id: string;
                email: string;
                passwordHash: string;
                name: string;
                isActive: boolean;
                platformRole: import(".prisma/client").$Enums.PlatformRole | null;
                createdAt: Date;
                updatedAt: Date;
                address: string | null;
                phone: string | null;
                profileImageUrl: string | null;
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
        VisitDistribution: ({
            PromotionalItem: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                organizationId: string;
                type: import(".prisma/client").$Enums.PromoItemType;
                totalStock: number;
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
    }>;
    getTeamDelegates(orgUserId: string, orgId: string): Promise<{
        id: string;
        User: {
            email: string;
            name: string;
        };
        businessRole: import(".prisma/client").$Enums.BusinessRole;
        Team_OrganizationUser_teamIdToTeam: {
            id: string;
            name: string;
        };
    }[]>;
    create(dto: CreateVisitDto, orgUserId: string, orgId: string, businessRole: string): Promise<{
        doctor: {
            firstName: string;
            lastName: string;
        };
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
        description: string | null;
        visitedAt: Date;
        doctorId: string;
        delegateId: string;
        status: import(".prisma/client").$Enums.VisitStatus;
        notes: string | null;
        nextVisitDate: Date | null;
        completedAt: Date | null;
    }>;
    submitReport(id: string, dto: SubmitReportDto, orgUserId: string, orgId: string, businessRole: string): Promise<{
        doctor: {
            firstName: string;
            lastName: string;
        };
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
        VisitDistribution: ({
            PromotionalItem: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                organizationId: string;
                type: import(".prisma/client").$Enums.PromoItemType;
                totalStock: number;
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
    }>;
    update(id: string, dto: UpdateVisitDto, orgUserId: string, orgId: string, businessRole: string): Promise<{
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
    }>;
    remove(id: string, orgUserId: string, orgId: string, businessRole: string): Promise<{
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
    }>;
    private _getDsmTeamDelegateIds;
    private _assertDelegateInDsmTeam;
}
