import { BaseAssembler } from "../../shared/infrastructure/base-assembler";
import { Assignment } from "../domain/entities/assignment.entity";
import { AssignmentResource, AssignmentResponse } from "./assignment-response";

export class AssignmentAssembler implements BaseAssembler<Assignment, AssignmentResource, AssignmentResponse> {
    toEntitiesFromResponse(response: AssignmentResponse): Assignment[] {
        return response.assignments.map(resource => this.toEntityFromResource(resource));
    }

    toEntityFromResource(resource: AssignmentResource): Assignment {
        return new Assignment(resource);
    }

    toResourceFromEntity(entity: Assignment): AssignmentResource {
        return {
            id: entity.id,
            studentName: entity.studentName,
            studentId: entity.studentId,
            routeName: entity.routeName,
            vehiclePlate: entity.vehiclePlate,
            shift: entity.shift as any,
            status: entity.status as any,
            tutorName: entity.tutorName
        };
    }
}
