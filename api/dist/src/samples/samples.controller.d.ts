import { SamplesService, CreateSampleDto } from './samples.service';
export declare class SamplesController {
    private service;
    constructor(service: SamplesService);
    findAll(orgId: string, userId: string, role: string): Promise<any[]>;
    monthlyReport(orgId: string): Promise<any[]>;
    create(dto: CreateSampleDto, userId: string, orgId: string): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
