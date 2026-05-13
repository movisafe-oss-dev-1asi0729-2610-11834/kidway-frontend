import { BaseResource, BaseResponse } from "../../shared/infrastructure/base-response";

export interface AssignmentResource extends BaseResource {
    id: number;
    studentName: string;
    studentId: string;
    routeName: string;
    vehiclePlate: string;
    shift: 'Morning' | 'Afternoon';
    status: 'Active' | 'Inactive';
    tutorName: string;
}

export interface AssignmentResponse extends BaseResponse {
    assignments: AssignmentResource[];
}
