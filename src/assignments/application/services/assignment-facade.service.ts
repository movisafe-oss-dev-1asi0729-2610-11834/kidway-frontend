import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AssignmentEntity } from '../../domain/entities/assignment.entity';
import { AssignmentDashboardModel } from '../../domain/models/assignment-dashboard.model';
import { AssignmentApiService } from '../../infrastructure/http/assignment-api.service';
import { AssignmentFilterState } from '../state/assignment-filter.state';

@Injectable({ providedIn: 'root' })
export class AssignmentFacadeService {
  private readonly api = inject(AssignmentApiService);
  private readonly filters = inject(AssignmentFilterState);

  loadDashboard(): Observable<AssignmentDashboardModel> {
    return this.api.getDashboard().pipe(
      tap((dashboard) => this.filters.setAssignments(dashboard.assignments))
    );
  }

  createAssignment(assignment: AssignmentEntity): Observable<AssignmentEntity> {
    return this.api.createAssignment(assignment);
  }

  updateAssignment(assignment: AssignmentEntity): Observable<AssignmentEntity> {
    return this.api.updateAssignment(assignment);
  }

  deleteAssignment(id: string): Observable<void> {
    return this.api.deleteAssignment(id);
  }
}
