import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Trip } from '../../domain/models/trip.model';

@Injectable({ providedIn: 'root' })
export class TripHttpService {
  private mockTrips: Trip[] = [
    { id: 1, driverName: 'Juan Pérez', vehiclePlate: 'ABC-123', status: 'scheduled' },
    { id: 2, driverName: 'Maria Lopez', vehiclePlate: 'XYZ-789', status: 'on-progress', startTime: new Date() }
  ];

  getTrips(): Observable<Trip[]> {
    return of(this.mockTrips).pipe(delay(500));
  }

  updateTripStatus(id: number, status: 'on-progress' | 'completed'): Observable<boolean> {
    const trip = this.mockTrips.find(t => t.id === id);
    if (trip) {
      trip.status = status;
      if (status === 'on-progress') trip.startTime = new Date();
      if (status === 'completed') trip.endTime = new Date();
    }
    return of(true).pipe(delay(300));
  }
}