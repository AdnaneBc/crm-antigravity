import { PrismaService } from '../prisma/prisma.service';
export declare class CreateSampleDto {
    productId: string;
    doctorId: string;
    quantity: number;
}
export declare class SamplesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(orgId: string, userId: string, role: string): Promise<any[]>;
    monthlyReport(orgId: string): Promise<any[]>;
    create(dto: CreateSampleDto, userId: string, orgId: string): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
