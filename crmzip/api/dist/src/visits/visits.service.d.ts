import { PrismaService } from '../prisma/prisma.service';
export declare class CreateVisitDto {
    doctorId: string;
    visitedAt: string;
    notes?: string;
}
export declare class UpdateVisitDto {
    visitedAt?: string;
    notes?: string;
}
export declare class ValidateVisitDto {
    action: 'approve' | 'reject';
    rejectionReason?: string;
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
    findAll(orgId: string, orgUserId: string, businessRole: string, query?: any): Promise<any>;
    findOne(id: string, orgId: string): Promise<{
        OrganizationUser: {
            User: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                passwordHash: string;
                firstName: string;
                lastName: string;
                platformRole: import(".prisma/client").$Enums.PlatformRole | null;
                address: string | null;
                phone: string | null;
                profileImageUrl: string | null;
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
        doctor: {
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
        };
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
    }>;
    getTeamDelegates(orgUserId: string, orgId: string): Promise<any>;
    getPendingValidationCount(orgUserId: string, orgId: string, businessRole: string): Promise<{
        count: number;
    }>;
    create(dto: CreateVisitDto, orgUserId: string, orgId: string, businessRole: string): Promise<any>;
    validate(id: string, dto: ValidateVisitDto, orgUserId: string, orgId: string, businessRole: string): Promise<any>;
    submitReport(id: string, dto: SubmitReportDto, orgUserId: string, orgId: string, businessRole: string): Promise<any>;
    update(id: string, dto: UpdateVisitDto, orgUserId: string, orgId: string, businessRole: string): Promise<{
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
    }>;
    cancel(id: string, orgUserId: string, orgId: string, businessRole: string): Promise<{
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
    }>;
    remove(id: string, orgUserId: string, orgId: string, businessRole: string): Promise<{
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
    }>;
    private _getDsmTeamDelegateIds;
    private _assertDelegateInDsmTeam;
    private _getStockAlerts;
}
