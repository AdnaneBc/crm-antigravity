import { PrismaService } from '../prisma/prisma.service';
import { BusinessRole, OrganizationRole } from '@prisma/client';
export declare class CreateOrgUserDto {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    businessRole?: BusinessRole;
    organizationRole?: OrganizationRole;
    teamId?: string;
    managerId?: string;
    phone?: string;
    fullName?: string;
    gender?: string;
    city?: string;
    gamme?: string;
    assignedSectors?: string[];
}
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(orgId: string, orgUserId?: string, businessRole?: string): Promise<any>;
    findOne(id: string): Promise<any>;
    create(dto: CreateOrgUserDto, orgId: string): Promise<any>;
    update(id: string, dto: Partial<CreateOrgUserDto>): Promise<{
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
    }>;
    deactivate(id: string): Promise<{
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
    }>;
    getTeams(orgId: string, orgUserId?: string, businessRole?: string): Promise<any>;
}
