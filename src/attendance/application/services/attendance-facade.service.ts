import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AttendanceDashboardModel } from '../../domain/models/attendance-dashboard.model';
import { AttendanceApiService } from '../../infrastructure/http/attendance-api.service';

@Injectable({ providedIn: 'root' })
export class AttendanceFacadeService {
  private readonly api = inject(AttendanceApiService);

  loadDashboard(): Observable<AttendanceDashboardModel> {
    return this.api.getDashboard();
  }
}
