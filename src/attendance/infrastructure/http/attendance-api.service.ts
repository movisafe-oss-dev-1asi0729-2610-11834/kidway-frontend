import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { AttendanceRecordEntity } from '../../domain/entities/attendance-record.entity';
import { AttendanceDashboardModel } from '../../domain/models/attendance-dashboard.model';
import { AttendanceStatus } from '../../domain/models/attendance-status.type';
import { AttendanceDashboardAssembler } from '../attendance-dashboard-assembler';
import { AttendanceDashboardApiResponse } from '../attendance-dashboard-api';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AttendanceApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiBaseUrl}/attendanceDashboard`;

  getDashboard(): Observable<AttendanceDashboardModel> {
    return this.http.get<AttendanceDashboardApiResponse>(this.endpoint).pipe(
      map((response) => AttendanceDashboardAssembler.toDashboard(response)),
      catchError(() => of(this.fallbackDashboard()))
    );
  }

  private fallbackDashboard(): AttendanceDashboardModel {
    const records: AttendanceRecordEntity[] = [
      this.record('att-001', 'Sofía Vega', 'AL-001', '4th Grade', 'Lima Norte School', 'Ruta Norte', 'KW-204', 'Carlos Pérez', 'Calle Pino 42', 'Lima Norte gate', '06:45 - 06:55', '07:18 AM', null, '07:45 AM', 'arrived', 98, 'Student arrived at destination.'),
      this.record('att-002', 'Diego Ruiz', 'AL-002', '5th Grade', 'Santa Maria School', 'Ruta Sur', 'KW-105', 'María Gómez', 'Av. Robles 115', 'Santa Maria gate', '06:50 - 07:00', '07:20 AM', null, '08:00 AM', 'on_board', 95, 'Student is currently on board.'),
      this.record('att-003', 'Valeria Cruz', 'AL-003', '1st Secondary', 'Cambridge School', 'Ruta Este', 'KW-308', 'Luis Torres', 'Javier Prado checkpoint', 'Cambridge main door', '07:05 - 07:15', null, null, '07:50 AM', 'waiting', 0, 'Waiting at the assigned pickup point.'),
      this.record('att-004', 'Mateo Lara', 'AL-004', '2nd Grade', 'Lima Norte School', 'Ruta Norte', 'KW-204', 'Carlos Pérez', 'Plaza Norte', 'Lima Norte gate', '06:45 - 06:55', null, null, '07:45 AM', 'absent', 0, 'Guardian confirmed student absence.'),
      this.record('att-005', 'Isabella Pinto', 'AL-005', '3rd Grade', 'Santa Maria School', 'Ruta Sur', 'KW-105', 'María Gómez', 'Col. Las Flores', 'Santa Maria gate', '06:55 - 07:05', null, null, '08:10 AM', 'pending_confirmation', 0, 'Absence reason still requires confirmation.'),
      this.record('att-006', 'Alonso Higa', 'AL-006', '1st Grade', 'Newton College', 'La Molina Afternoon Route', 'KW-311', 'Andrea Rojas', 'Av. Los Fresnos 233', 'Newton College gate', '15:05 - 15:15', '03:09 PM', '04:01 PM', '04:05 PM', 'arrived', 97, 'Afternoon route completed correctly.')
    ];
    return {
      summary: this.summaryFrom(records),
      records,
      reviews: [
        { id: 'attendance-review-001', title: 'Absence confirmation pending', description: 'Isabella Pinto still needs guardian confirmation for today\'s absence.', severity: 'high', studentCode: 'AL-005', dueDate: '2026-07-09' },
        { id: 'attendance-review-002', title: 'Pickup punctuality review', description: 'Valeria Cruz was waiting at the stop and requires route coordination follow-up.', severity: 'medium', studentCode: 'AL-003', dueDate: '2026-07-10' }
      ],
      activities: [
        { id: 'attendance-activity-001', time: '7:20 AM', title: 'Boarding confirmed', description: 'Diego Ruiz boarded KW-105 on Ruta Sur.', status: 'active' },
        { id: 'attendance-activity-002', time: '7:18 AM', title: 'Arrival registered', description: 'Sofía Vega arrived at Lima Norte School.', status: 'completed' },
        { id: 'attendance-activity-003', time: '7:05 AM', title: 'Absence requires validation', description: 'Isabella Pinto was marked as absent and needs guardian confirmation.', status: 'pending' }
      ]
    };
  }

  private record(id: string, studentName: string, studentCode: string, grade: string, school: string, routeName: string, vehiclePlate: string, driverName: string, pickupPoint: string, dropOffPoint: string, pickupWindow: string, checkInTime: string | null, dropOffTime: string | null, estimatedArrival: string, status: AttendanceStatus, reliability: number, notes: string): AttendanceRecordEntity {
    return {
      id,
      code: id.replace('att-', 'AT-'),
      studentName,
      studentCode,
      grade,
      guardianName: studentName.includes('Sofía') ? 'María Vega' : studentName.includes('Diego') ? 'Juan Ruiz' : studentName.includes('Valeria') ? 'Elena Cruz' : studentName.includes('Mateo') ? 'Rosa Lara' : studentName.includes('Isabella') ? 'Laura Pinto' : 'Jorge Higa',
      guardianPhone: '+51 9' + String(Math.floor(Math.random() * 90000000 + 10000000)),
      routeName,
      vehiclePlate,
      driverName,
      school,
      pickupPoint,
      dropOffPoint,
      pickupWindow,
      checkInTime,
      dropOffTime,
      estimatedArrival,
      status,
      tripCode: `TP-${studentCode.slice(-3)}`,
      reliability,
      lastEvent: status === 'arrived' ? 'Drop-off confirmed' : status === 'on_board' ? 'Boarding confirmed' : status === 'absent' ? 'Absence registered' : status === 'pending_confirmation' ? 'Confirmation pending' : 'Waiting at stop',
      notes
    };
  }

  private summaryFrom(records: AttendanceRecordEntity[]) {
    const totalAssigned = records.length;
    const onBoard = records.filter((record) => record.status === 'on_board').length;
    const arrived = records.filter((record) => record.status === 'arrived').length;
    const waiting = records.filter((record) => record.status === 'waiting').length;
    const absent = records.filter((record) => record.status === 'absent').length;
    const pendingConfirmation = records.filter((record) => record.status === 'pending_confirmation').length;
    const attended = onBoard + arrived;
    return {
      totalAssigned,
      onBoard,
      arrived,
      waiting,
      absent,
      pendingConfirmation,
      attendanceReliability: Math.round((attended / Math.max(totalAssigned - pendingConfirmation, 1)) * 1000) / 10
    };
  }
}
