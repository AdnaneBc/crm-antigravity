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
            name: string;
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
        email: string;
        name: string;
        platformRole: "SUPER_ADMIN";
        createdAt: Date;
        address: string;
        phone: string;
        profileImageUrl: string;
        OrganizationUser: {
            id: string;
            organizationId: string;
            organizationRole: import(".prisma/client").$Enums.OrganizationRole;
            businessRole: import(".prisma/client").$Enums.BusinessRole;
            managerId: string;
            teamId: string;
            Organization: {
                id: string;
                name: string;
                logoUrl: string;
                primaryColor: string;
            };
            Team_OrganizationUser_teamIdToTeam: {
                id: string;
                name: string;
            };
        }[];
    }>;
}
export {};
