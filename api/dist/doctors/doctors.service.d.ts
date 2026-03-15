import { PrismaService } from '../prisma/prisma.service';
import { DoctorType } from '@prisma/client';
export declare class CreateDoctorDto {
    firstName: string;
    lastName: string;
    speciality?: string;
    type: DoctorType;
    sectorId?: string;
    address?: string;
    phone?: string;
}
export declare class DoctorsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(orgId: string, query?: {
        search?: string;
        type?: string;
        sectorId?: string;
    }): Promise<({
        _count: {
            visits: number;
        };
        Sector: {
            id: string;
            name: string;
        };
    } & {
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
        })[];
    } & {
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
    }>;
    create(dto: CreateDoctorDto, orgId: string): Promise<{
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
    }>;
    update(id: string, dto: Partial<CreateDoctorDto>): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
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
}
