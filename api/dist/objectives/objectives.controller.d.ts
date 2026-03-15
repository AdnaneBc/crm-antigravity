import { ObjectivesService, CreateObjectiveDto, UpdateObjectiveProgressDto } from './objectives.service';
export declare class ObjectivesController {
    private service;
    constructor(service: ObjectivesService);
    findAll(orgId: string): Promise<any[]>;
    create(dto: CreateObjectiveDto, orgId: string): Promise<{
        message: string;
    }>;
    updateProgress(id: string, dto: UpdateObjectiveProgressDto): Promise<{
        message: string;
    }>;
}
