import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AssignmentEntity } from '../../domain/entities/assignment.entity';
import {
  AssignmentDashboardModel,
  FALLBACK_ASSIGNMENT_DASHBOARD
} from '../../domain/models/assignment-dashboard.model';

@Injectable({ providedIn: 'root' })
export class AssignmentApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiBaseUrl}/assignmentDashboard`;
  private readonly recordsEndpoint = `${environment.apiBaseUrl}/assignmentRecords`;

  getDashboard(): Observable<AssignmentDashboardModel> {
    return this.http.get<AssignmentDashboardModel>(this.endpoint).pipe(
      switchMap((dashboard) => this.getOrSeedRecords(dashboard.assignments).pipe(
        map((assignments) => ({
          ...dashboard,
          assignments: assignments.length ? assignments : dashboard.assignments
        }))
      )),
      catchError(() => of(FALLBACK_ASSIGNMENT_DASHBOARD))
    );
  }

  createAssignment(assignment: AssignmentEntity): Observable<AssignmentEntity> {
    return this.http.post<AssignmentEntity>(this.recordsEndpoint, assignment);
  }

  updateAssignment(assignment: AssignmentEntity): Observable<AssignmentEntity> {
    return this.http.patch<AssignmentEntity>(`${this.recordsEndpoint}/${assignment.id}`, assignment);
  }

  deleteAssignment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.recordsEndpoint}/${id}`);
  }

  private getOrSeedRecords(seed: AssignmentEntity[]): Observable<AssignmentEntity[]> {
    return this.http.get<AssignmentEntity[]>(this.recordsEndpoint).pipe(
      switchMap((records) => records.length ? of(records) : this.seedRecords(seed)),
      catchError(() => this.seedRecords(seed))
    );
  }

  private seedRecords(seed: AssignmentEntity[]): Observable<AssignmentEntity[]> {
    if (!seed.length) {
      return of([]);
    }
    return forkJoin(seed.map((assignment) => this.http.post<AssignmentEntity>(this.recordsEndpoint, assignment))).pipe(
      catchError(() => of(seed))
    );
  }
}
