import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { AssignmentApiEndpoint } from './assignment-api-endpoint';
import { Assignment } from '../domain/entities/assignment.entity';

@Injectable({ providedIn: 'root' })
export class AssignmentApi extends BaseApi {
    private readonly endpoint: AssignmentApiEndpoint;

    constructor(http: HttpClient) {
        super();
        this.endpoint = new AssignmentApiEndpoint(http);
    }

    getAssignments(): Observable<Assignment[]> {
        return this.endpoint.getAll();
    }

    createAssignment(assignment: Assignment): Observable<Assignment> {
        return this.endpoint.create(assignment);
    }

    updateAssignment(assignment: Assignment): Observable<Assignment> {
        return this.endpoint.update(assignment, assignment.id);
    }

    deleteAssignment(id: number): Observable<void> {
        return this.endpoint.delete(id);
    }
}
