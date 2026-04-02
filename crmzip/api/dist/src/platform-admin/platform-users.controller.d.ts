import { PlatformUsersService, CreatePlatformUserDto, UpdatePlatformUserDto, AssignOrganizationDto, ResetPasswordDto } from './platform-users.service';
export declare class PlatformUsersController {
    private service;
    constructor(service: PlatformUsersService);
    findAll(search?: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        platformRole: "SUPER_ADMIN";
        createdAt: Date;
        phone: string;
        OrganizationUser: {
            id: string;
            isActive: boolean;
            organizationId: string;
            organizationRole: import(".prisma/client").$Enums.OrganizationRole;
            businessRole: import(".prisma/client").$Enums.BusinessRole;
            Organization: {
                id: string;
                name: string;
            };
        }[];
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        platformRole: "SUPER_ADMIN";
        createdAt: Date;
        updatedAt: Date;
        address: string;
        phone: string;
        profileImageUrl: string;
        OrganizationUser: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            organizationId: string;
            organizationRole: import(".prisma/client").$Enums.OrganizationRole;
            businessRole: import(".prisma/client").$Enums.BusinessRole;
            fullName: string;
            Organization: {
                id: string;
                isActive: boolean;
                name: string;
            };
        }[];
    }>;
    create(dto: CreatePlatformUserDto): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        platformRole: "SUPER_ADMIN";
        createdAt: Date;
    }>;
    update(id: string, dto: UpdatePlatformUserDto): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        platformRole: "SUPER_ADMIN";
    }>;
    deactivate(id: string): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        platformRole: import(".prisma/client").$Enums.PlatformRole | null;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        phone: string | null;
        profileImageUrl: string | null;
    }>;
    resetPassword(id: string, dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    assignOrganization(id: string, dto: AssignOrganizationDto): Promise<{
        Organization: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        userId: string;
        organizationId: string;
        organizationRole: import(".prisma/client").$Enums.OrganizationRole;
        businessRole: import(".prisma/client").$Enums.BusinessRole | null;
        managerId: string | null;
        teamId: string | null;
        fullName: string | null;
        gender: string | null;
        city: string | null;
        gamme: string | null;
        assignedSectors: string[];
    }>;
    revokeOrganization(id: string, orgId: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        userId: string;
        organizationId: string;
        organizationRole: import(".prisma/client").$Enums.OrganizationRole;
        businessRole: import(".prisma/client").$Enums.BusinessRole | null;
        managerId: string | null;
        teamId: string | null;
        fullName: string | null;
        gender: string | null;
        city: string | null;
        gamme: string | null;
        assignedSectors: string[];
    }>;
}
