import { Injectable } from '@angular/core';
import { TripHttpService } from '../../infrastructure/http/trip-http.service';
import { Trip } from '../../domain/models/trip.model';

@Injectable({ providedIn: 'root' })
export class TripService {
  constructor(private tripHttp: TripHttpService) {}

  fetchTrips() {
    return this.tripHttp.getTrips();
  }

  startTrip(id: number) {
    return this.tripHttp.updateTripStatus(id, 'on-progress');
  }

  finishTrip(id: number) {
    return this.tripHttp.updateTripStatus(id, 'completed');
  }
}