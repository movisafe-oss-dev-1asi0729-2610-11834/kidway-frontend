import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';

import { StudentResource, StudentsResponse } from './students-response';
import { StudentAssembler } from './student-assembler';

import {Student} from "../domain/entities/student.entity";
import {environment} from "../../environments/environment";

export class StudentsApiEndpoint extends BaseApiEndpoint<Student, StudentResource, StudentsResponse, StudentAssembler> {
    constructor(http: HttpClient) {
        super(http, `${environment.apiBaseUrl}/students`, new StudentAssembler());
    }
}
