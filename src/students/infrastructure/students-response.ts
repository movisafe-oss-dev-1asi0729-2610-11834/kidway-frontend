import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface StudentResource extends BaseResource {
    id: number;
    code: string;
    firstName: string;
    lastName: string;
    grade: string;
    tutorName: string;
    tutorContact: string;
    routeAssigned: string | null;
    stopName: string | null;
    status: 'Activo' | 'Sin ruta' | 'Inactivo';
}

export interface StudentsResponse extends BaseResponse {
    students: StudentResource[];
}
