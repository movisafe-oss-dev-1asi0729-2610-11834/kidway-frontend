import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
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
}
