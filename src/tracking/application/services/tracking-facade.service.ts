import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TrackingApiService } from '../../infrastructure/http/tracking-api.service';
import { TrackingDashboardModel } from '../../domain/models/tracking-dashboard.model';

@Injectable({ providedIn: 'root' })
export class TrackingFacadeService {
  private readonly api = inject(TrackingApiService);

  loadDashboard(): Observable<TrackingDashboardModel> {
    return this.api.getDashboard();
  }
}
