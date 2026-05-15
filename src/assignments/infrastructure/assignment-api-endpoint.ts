import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { AssignmentResource, AssignmentResponse } from './assignment-response';
import { AssignmentAssembler } from './assignment-assembler';
import { Assignment } from '../domain/entities/assignment.entity';
import {environment} from "../../environments/environment";


export class AssignmentApiEndpoint extends BaseApiEndpoint<Assignment, AssignmentResource, AssignmentResponse, AssignmentAssembler> {
    constructor(http: HttpClient) {
        super(http, `${environment.apiBaseUrl}/assignments`, new AssignmentAssembler());
    }
}
