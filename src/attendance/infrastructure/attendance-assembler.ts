import { BaseAssembler } from "../../shared/infrastructure/base-assembler";
import { Attendance } from "../domain/entities/attendance.entity";
import { AttendanceResource, AttendanceResponse } from "./attendance-response";

export class AttendanceAssembler implements BaseAssembler<Attendance, AttendanceResource, AttendanceResponse> {
    toEntitiesFromResponse(response: AttendanceResponse): Attendance[] {
        return response.attendance.map(resource => this.toEntityFromResource(resource));
    }

    toEntityFromResource(resource: AttendanceResource): Attendance {
        return new Attendance(resource);
    }

    toResourceFromEntity(entity: Attendance): AttendanceResource {
        return {
            id: entity.id,
            studentName: entity.studentName,
            studentId: entity.studentId,
            initials: entity.initials,
            routeName: entity.routeName,
            vehiclePlate: entity.vehiclePlate,
            status: entity.status as any,
            checkInTime: entity.checkInTime,
            estimatedArrival: entity.estimatedArrival,
            tutorName: entity.tutorName
        };
    }
}
