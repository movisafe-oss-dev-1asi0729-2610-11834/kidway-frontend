import { computed, Injectable, signal } from '@angular/core';
import { AttendanceRecordEntity } from '../../domain/entities/attendance-record.entity';
import { AttendanceStatusFilter } from '../../domain/models/attendance-status.type';

@Injectable({ providedIn: 'root' })
export class AttendanceFilterState {
  private readonly recordsSignal = signal<AttendanceRecordEntity[]>([]);
  private readonly searchSignal = signal('');
  private readonly statusSignal = signal<AttendanceStatusFilter>('all');
  private readonly routeSignal = signal('all');

  readonly records = this.recordsSignal.asReadonly();
  readonly searchTerm = this.searchSignal.asReadonly();
  readonly selectedStatus = this.statusSignal.asReadonly();
  readonly selectedRoute = this.routeSignal.asReadonly();

  readonly routes = computed(() => ['all', ...new Set(this.records().map((record) => record.routeName))]);

  readonly filteredRecords = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();
    const route = this.selectedRoute();
    return this.records().filter((record) => {
      const matchesStatus = status === 'all' || record.status === status;
      const matchesRoute = route === 'all' || record.routeName === route;
      const matchesSearch = !term || [record.studentName, record.studentCode, record.guardianName, record.routeName, record.vehiclePlate, record.driverName, record.pickupPoint, record.school]
        .some((value) => value.toLowerCase().includes(term));
      return matchesStatus && matchesRoute && matchesSearch;
    });
  });

  setRecords(records: AttendanceRecordEntity[]): void {
    this.recordsSignal.set(records);
  }

  setSearchTerm(term: string): void {
    this.searchSignal.set(term);
  }

  setStatus(status: AttendanceStatusFilter): void {
    this.statusSignal.set(status);
  }

  setRoute(route: string): void {
    this.routeSignal.set(route);
  }
}
