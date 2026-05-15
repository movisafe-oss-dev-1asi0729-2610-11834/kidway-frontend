import { Injectable } from '@angular/core';
import { TrackingSocketService } from '../../infrastructure/http/tracking-socket.service';
import { Observable } from 'rxjs';
import { VehicleLocation } from '../../domain/models/location.model';

@Injectable({ providedIn: 'root' })
export class TrackingService {
  constructor(private socketService: TrackingSocketService) {}

  // Agregamos los [] para indicar que es una lista de vehículos
  public subscribeToVehicleTracking(): Observable<VehicleLocation[]> {
    return this.socketService.getLiveUpdates();
  }
}