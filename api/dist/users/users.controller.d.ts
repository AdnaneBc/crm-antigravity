import { UsersService, CreateOrgUserDto } from './users.service';
export declare class UsersController {
    private service;
    constructor(service: UsersService);
    findAll(orgId: string): Promise<({
        OrganizationUser: {
            id: string;
            User: {
                name: string;
            };
        };
        User: {
            id: string;
            email: string;
            name: string;
            phone: string;
            profileImageUrl: string;
        };
        Team_OrganizationUser_teamIdToTeam: {
            id: string;
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
    })[]>;
    getTeams(orgId: string): Promise<({
        OrganizationUser_OrganizationUser_teamIdToTeam: ({
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
        })[];
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
    })[]>;
    findOne(id: string): Promise<{
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
        other_OrganizationUser: ({
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
        })[];
        Team_OrganizationUser_teamIdToTeam: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            managerId: string;
        };
        Visit: ({
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
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        organizationId: string;
        organizationRole: import(".prisma/client").$Enums.OrganizationRole;
        businessRole: import(".prisma/client").$Enums.BusinessRole | null;
        managerId: string | null;
        teamId: string | null;
    }>;
    create(dto: CreateOrgUserDto, orgId: string): Promise<{
        User: {
            id: string;
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
    }>;
    update(id: string, dto: Partial<CreateOrgUserDto>): Promise<{
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
    }>;
    deactivate(id: string): Promise<{
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
    }>;
}
