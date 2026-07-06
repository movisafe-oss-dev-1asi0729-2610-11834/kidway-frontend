import { Injectable, computed, signal } from '@angular/core';
import { FleetStatus } from '../../domain/models/fleet-status.type';
import { VehicleEntity } from '../../domain/entities/vehicle.entity';

export type FleetStatusFilter = FleetStatus | 'all';

@Injectable({ providedIn: 'root' })
export class FleetFilterState {
  private readonly vehiclesSignal = signal<VehicleEntity[]>([]);
  readonly searchTerm = signal('');
  readonly selectedStatus = signal<FleetStatusFilter>('all');

  readonly vehicles = this.vehiclesSignal.asReadonly();

  readonly filteredVehicles = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();

    return this.vehiclesSignal().filter((vehicle) => {
      const matchesStatus = status === 'all' || vehicle.status === status;
      const matchesSearch =
        !query ||
        vehicle.plate.toLowerCase().includes(query) ||
        vehicle.code.toLowerCase().includes(query) ||
        vehicle.driverName.toLowerCase().includes(query) ||
        vehicle.routeName.toLowerCase().includes(query) ||
        vehicle.brand.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  });

  setVehicles(vehicles: VehicleEntity[]): void {
    this.vehiclesSignal.set(vehicles);
  }

  setSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  setStatus(value: FleetStatusFilter): void {
    this.selectedStatus.set(value);
  }
}
