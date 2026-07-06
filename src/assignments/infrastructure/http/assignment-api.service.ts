import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import {
  AssignmentDashboardModel,
  FALLBACK_ASSIGNMENT_DASHBOARD
} from '../../domain/models/assignment-dashboard.model';

@Injectable({ providedIn: 'root' })
export class AssignmentApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/assignmentDashboard';

  getDashboard(): Observable<AssignmentDashboardModel> {
    return this.http.get<AssignmentDashboardModel>(this.endpoint).pipe(
      catchError(() => of(FALLBACK_ASSIGNMENT_DASHBOARD))
    );
  }
}
