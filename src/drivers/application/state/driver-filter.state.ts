import { Injectable, computed, signal } from '@angular/core';
import { DriverEntity } from '../../domain/entities/driver.entity';
import { DriverStatus } from '../../domain/models/driver-status.type';

export type DriverStatusFilter = DriverStatus | 'all';

@Injectable({ providedIn: 'root' })
export class DriverFilterState {
  private readonly driversSignal = signal<DriverEntity[]>([]);
  readonly searchTerm = signal('');
  readonly selectedStatus = signal<DriverStatusFilter>('all');

  readonly drivers = this.driversSignal.asReadonly();

  readonly filteredDrivers = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();

    return this.driversSignal().filter((driver) => {
      const matchesStatus = status === 'all' || driver.status === status;
      const matchesSearch =
        !query ||
        driver.fullName.toLowerCase().includes(query) ||
        driver.code.toLowerCase().includes(query) ||
        driver.licenseNumber.toLowerCase().includes(query) ||
        driver.assignedVehicle.toLowerCase().includes(query) ||
        driver.assignedRoute.toLowerCase().includes(query) ||
        driver.email.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  });

  setDrivers(drivers: DriverEntity[]): void {
    this.driversSignal.set(drivers);
  }

  setSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  setStatus(value: DriverStatusFilter): void {
    this.selectedStatus.set(value);
  }
}
