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
    refresh(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    getProfile(userId: string): Promise<{
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
