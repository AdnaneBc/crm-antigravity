import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(email: string, password: string): Promise<{
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
    refresh(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    getProfile(userId: string): Promise<{
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
