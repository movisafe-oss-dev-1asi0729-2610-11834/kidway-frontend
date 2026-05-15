import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Trip } from '../../domain/models/trip.model';

@Injectable({ providedIn: 'root' })
export class TripHttpService {
  // Flota ampliada para una mejor visualización de la UI
  private mockTrips: Trip[] = [
    { id: 1, driverName: 'Juan Pérez', vehiclePlate: 'ABC-123', status: 'scheduled' },
    { id: 2, driverName: 'Maria Lopez', vehiclePlate: 'XYZ-789', status: 'on-progress', startTime: new Date() },
    { id: 3, driverName: 'Ricardo Palma', vehiclePlate: 'BTP-456', status: 'scheduled' },
    { id: 4, driverName: 'Elena Guevara', vehiclePlate: 'VRT-102', status: 'on-progress', startTime: new Date() },
    { id: 5, driverName: 'Roberto Gomez', vehiclePlate: 'MNO-555', status: 'completed', startTime: new Date(), endTime: new Date() },
    { id: 6, driverName: 'Lucia Méndez', vehiclePlate: 'LIT-888', status: 'scheduled' }
  ];

  getTrips(): Observable<Trip[]> {
    // Simulamos un pequeño retraso de red para que se vea el estado de carga
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