import { AuthService } from './auth.service';
declare class LoginDto {
    email: string;
    password: string;
}
declare class RefreshDto {
    refreshToken: string;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            platformRole: "SUPER_ADMIN";
            orgUserId: any;
            organizationId: any;
            organizationRole: any;
            businessRole: any;
            teamId: any;
            organization: {
                id: any;
                name: any;
            };
        };
    }>;
    refresh(dto: RefreshDto): Promise<{
        accessToken: string;
    }>;
    me(userId: string): Promise<{
        id: string;
        createdAt: Date;
        OrganizationUser: {
            id: string;
            Organization: {
                id: string;
                name: string;
                logoUrl: string;
                primaryColor: string;
            };
            organizationRole: import(".prisma/client").$Enums.OrganizationRole;
            businessRole: import(".prisma/client").$Enums.BusinessRole;
            Team_OrganizationUser_teamIdToTeam: {
                id: string;
                name: string;
            };
            organizationId: string;
            managerId: string;
            teamId: string;
        }[];
        email: string;
        firstName: string;
        lastName: string;
        platformRole: "SUPER_ADMIN";
        address: string;
        phone: string;
        profileImageUrl: string;
    }>;
}
export {};
