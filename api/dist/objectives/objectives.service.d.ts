import { PrismaService } from '../prisma/prisma.service';
export declare class CreateObjectiveDto {
    userId: string;
    targetVisits: number;
    targetCoverage: number;
    targetSamples: number;
    period: string;
}
export declare class UpdateObjectiveProgressDto {
    achievedVisits?: number;
}
export declare class ObjectivesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(orgId: string): Promise<any[]>;
    create(dto: CreateObjectiveDto, orgId: string): Promise<{
        message: string;
    }>;
    updateProgress(id: string, dto: UpdateObjectiveProgressDto): Promise<{
        message: string;
    }>;
}
