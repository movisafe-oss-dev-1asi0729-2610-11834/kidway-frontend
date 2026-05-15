import { Injectable } from '@angular/core';
import { Observable, interval, map } from 'rxjs';
import { VehicleLocation } from '../../domain/models/location.model';

@Injectable({ providedIn: 'root' })
export class TrackingSocketService {
  public getLiveUpdates(): Observable<VehicleLocation> {
    return interval(3000).pipe(
      map(() => ({
        vehicleId: 'BUS-001',
        latitude: -12.086 + (Math.random() * 0.001), // Simulación en Lima
        longitude: -77.031 + (Math.random() * 0.001),
        speed: 35 + Math.random() * 10,
        updatedAt: new Date()
      }))
    );
  }
}