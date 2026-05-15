import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { AttendanceApiEndpoint } from './attendance-api-endpoint';
import { Attendance } from '../domain/entities/attendance.entity';

@Injectable({ providedIn: 'root' })
export class AttendanceApi extends BaseApi {
    private readonly endpoint: AttendanceApiEndpoint;

    constructor(http: HttpClient) {
        super();
        this.endpoint = new AttendanceApiEndpoint(http);
    }

    getAttendance(): Observable<Attendance[]> {
        return this.endpoint.getAll();
    }

    updateStatus(attendance: Attendance): Observable<Attendance> {
        return this.endpoint.update(attendance, attendance.id);
    }
}
