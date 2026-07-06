import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TripEntity } from '../../domain/entities/trip.entity';
import { TripDashboardModel } from '../../domain/models/trip-dashboard.model';
import { TripAssembler } from '../trip-assembler';
import { TripsApiResponse } from '../trips-api';

@Injectable({ providedIn: 'root' })
export class TripApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiBaseUrl}/tripDashboard`;
  private readonly recordsEndpoint = `${environment.apiBaseUrl}/tripRecords`;

  getDashboard(): Observable<TripDashboardModel> {
    return this.http.get<TripsApiResponse>(this.endpoint).pipe(
      map((response) => TripAssembler.toDashboard(response)),
      switchMap((dashboard) => this.getOrSeedRecords(dashboard.trips).pipe(
        map((trips) => ({
          ...dashboard,
          trips: trips.length ? trips : dashboard.trips
        }))
      )),
      catchError(() => of(this.fallbackDashboard()))
    );
  }

  createTrip(trip: TripEntity): Observable<TripEntity> {
    return this.http.post<TripEntity>(this.recordsEndpoint, trip);
  }

  updateTrip(trip: TripEntity): Observable<TripEntity> {
    return this.http.patch<TripEntity>(`${this.recordsEndpoint}/${trip.id}`, trip);
  }

  deleteTrip(id: string): Observable<void> {
    return this.http.delete<void>(`${this.recordsEndpoint}/${id}`);
  }

  private getOrSeedRecords(seed: TripEntity[]): Observable<TripEntity[]> {
    return this.http.get<TripEntity[]>(this.recordsEndpoint).pipe(
      switchMap((records) => records.length ? of(records) : this.seedRecords(seed)),
      catchError(() => this.seedRecords(seed))
    );
  }

  private seedRecords(seed: TripEntity[]): Observable<TripEntity[]> {
    if (!seed.length) {
      return of([]);
    }
    return forkJoin(seed.map((trip) => this.http.post<TripEntity>(this.recordsEndpoint, trip))).pipe(
      catchError(() => of(seed))
    );
  }

  private fallbackDashboard(): TripDashboardModel {
    return {
      summary: {
        totalTrips: 18,
        activeTrips: 5,
        scheduledTrips: 7,
        delayedTrips: 2,
        completedTrips: 11,
        serviceReliability: 93
      },
      trips: [],
      reviews: [],
      activities: []
    };
  }
}
