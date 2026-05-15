import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { StudentResource, StudentsResponse } from './students-response';
import {Student} from "../domain/entities/student.entity";

export class StudentAssembler implements BaseAssembler<Student, StudentResource, StudentsResponse> {
    toEntitiesFromResponse(response: StudentsResponse): Student[] {
        return response.students.map(resource => this.toEntityFromResource(resource));
    }

    toEntityFromResource(resource: StudentResource): Student {
        return new Student({
            id: resource.id,
            code: resource.code,
            firstName: resource.firstName,
            lastName: resource.lastName,
            grade: resource.grade,
            tutorName: resource.tutorName,
            tutorContact: resource.tutorContact,
            routeAssigned: resource.routeAssigned,
            stopName: resource.stopName,
            status: resource.status
        });
    }

    toResourceFromEntity(entity: Student): StudentResource {
        return {
            id: entity.id,
            code: entity.code,
            firstName: entity.firstName,
            lastName: entity.lastName,
            grade: entity.grade,
            tutorName: entity.tutorName,
            tutorContact: entity.tutorContact,
            routeAssigned: entity.routeAssigned,
            stopName: entity.stopName,
            status: entity.status as any
        };
    }
}
