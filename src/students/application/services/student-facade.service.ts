import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { StudentDashboardModel } from '../../domain/models/student-dashboard.model';
import { StudentApiService } from '../../infrastructure/http/student-api.service';
import { StudentFilterState } from '../state/student-filter.state';

@Injectable({ providedIn: 'root' })
export class StudentFacadeService {
  private readonly api = inject(StudentApiService);
  private readonly filters = inject(StudentFilterState);

  loadDashboard(): Observable<StudentDashboardModel> {
    return this.api.getDashboard().pipe(tap((dashboard) => this.filters.setStudents(dashboard.students)));
  }
}
