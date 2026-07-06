import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TripEntity } from '../../domain/entities/trip.entity';
import { TripDashboardModel } from '../../domain/models/trip-dashboard.model';
import { TripApiService } from '../../infrastructure/http/trip-api.service';

@Injectable({ providedIn: 'root' })
export class TripFacadeService {
  private readonly api = inject(TripApiService);

  loadDashboard(): Observable<TripDashboardModel> {
    return this.api.getDashboard();
  }

  createTrip(trip: TripEntity): Observable<TripEntity> {
    return this.api.createTrip(trip);
  }

  updateTrip(trip: TripEntity): Observable<TripEntity> {
    return this.api.updateTrip(trip);
  }

  deleteTrip(id: string): Observable<void> {
    return this.api.deleteTrip(id);
  }
}
