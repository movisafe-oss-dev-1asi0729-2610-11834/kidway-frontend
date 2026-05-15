import { Injectable } from '@angular/core';
import { Observable, interval, map } from 'rxjs';
import { VehicleLocation } from '../../domain/models/location.model';

@Injectable({ providedIn: 'root' })
export class TrackingSocketService {
  private vehicles = [
    { id: 'BUS-101', dist: 'Surco', lat: -12.129, lng: -77.001 },
    { id: 'BUS-202', dist: 'San Borja', lat: -12.107, lng: -76.999 },
    { id: 'BUS-303', dist: 'La Molina', lat: -12.071, lng: -76.942 }
  ];

  public getLiveUpdates(): Observable<VehicleLocation[]> { // Ahora devuelve un array
    return interval(3000).pipe(
      map(() => this.vehicles.map(v => ({
        vehicleId: v.id,
        district: v.dist,
        latitude: v.lat + (Math.random() * 0.002),
        longitude: v.lng + (Math.random() * 0.002),
        speed: 20 + Math.random() * 15,
        updatedAt: new Date()
      })))
    );
  }
}