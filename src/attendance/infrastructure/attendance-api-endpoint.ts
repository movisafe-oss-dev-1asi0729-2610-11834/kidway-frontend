import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { AttendanceResource, AttendanceResponse } from './attendance-response';
import { AttendanceAssembler } from './attendance-assembler';
import { Attendance } from '../domain/entities/attendance.entity';
import {environment} from "../../environments/environment";


export class AttendanceApiEndpoint extends BaseApiEndpoint<Attendance, AttendanceResource, AttendanceResponse, AttendanceAssembler> {
    constructor(http: HttpClient) {
        super(http, `${environment.apiBaseUrl}/attendance`, new AttendanceAssembler());
    }
}
