import { Injectable, computed, signal } from '@angular/core';
import { TrackingStatus } from '../../domain/models/tracking-status.type';
import { TrackingVehicleEntity } from '../../domain/entities/tracking-vehicle.entity';

@Injectable({ providedIn: 'root' })
export class TrackingFilterState {
  readonly query = signal('');
  readonly status = signal<TrackingStatus | 'all'>('all');

  filterVehicles(vehicles: TrackingVehicleEntity[]): TrackingVehicleEntity[] {
    const query = this.query().trim().toLowerCase();
    const status = this.status();

    return vehicles.filter((vehicle) => {
      const matchesStatus = status === 'all' || vehicle.status === status;
      const searchable = [
        vehicle.vehicleId,
        vehicle.plate,
        vehicle.driverName,
        vehicle.routeName,
        vehicle.schoolName,
        vehicle.district,
        vehicle.nextStop
      ].join(' ').toLowerCase();
      const matchesQuery = !query || searchable.includes(query);
      return matchesStatus && matchesQuery;
    });
  }
}
