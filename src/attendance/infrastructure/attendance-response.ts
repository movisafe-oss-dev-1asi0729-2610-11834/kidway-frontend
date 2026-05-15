import { BaseResource, BaseResponse } from "../../shared/infrastructure/base-response";

export interface AttendanceResource extends BaseResource {
    id: number;
    studentName: string;
    studentId: string;
    initials: string;
    routeName: string;
    vehiclePlate: string;
    status: 'On board' | 'Boarded' | 'Absent' | 'Waiting';
    checkInTime: string | null;
    estimatedArrival: string | null;
    tutorName: string;
}

export interface AttendanceResponse extends BaseResponse {
    attendance: AttendanceResource[];
}
