import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TripDashboardModel } from '../../domain/models/trip-dashboard.model';
import { TripApiService } from '../../infrastructure/http/trip-api.service';

@Injectable({ providedIn: 'root' })
export class TripFacadeService {
  private readonly api = inject(TripApiService);

  loadDashboard(): Observable<TripDashboardModel> {
    return this.api.getDashboard();
  }
}
