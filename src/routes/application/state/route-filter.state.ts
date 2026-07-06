import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { SchoolRouteEntity } from '../../domain/entities/school-route.entity';
import { RouteStatus } from '../../domain/models/route-status.type';

export type RouteStatusFilter = RouteStatus | 'all';

@Injectable({ providedIn: 'root' })
export class RouteFilterState {
  private readonly routesSubject = new BehaviorSubject<SchoolRouteEntity[]>([]);
  private readonly statusSubject = new BehaviorSubject<RouteStatusFilter>('all');
  private readonly searchSubject = new BehaviorSubject<string>('');

  readonly selectedStatus$ = this.statusSubject.asObservable();
  readonly routes$ = this.routesSubject.asObservable();

  readonly filteredRoutes$ = combineLatest([
    this.routesSubject,
    this.statusSubject,
    this.searchSubject
  ]).pipe(
    map(([routes, status, search]) => {
      const normalizedSearch = search.trim().toLowerCase();
      return routes.filter((route) => {
        const matchesStatus = status === 'all' || route.status === status;
        const matchesSearch =
          !normalizedSearch ||
          [
            route.code,
            route.name,
            route.district,
            route.school,
            route.assignedDriver,
            route.assignedVehicle,
            route.scheduleLabel
          ]
            .join(' ')
            .toLowerCase()
            .includes(normalizedSearch);
        return matchesStatus && matchesSearch;
      });
    })
  );

  setRoutes(routes: SchoolRouteEntity[]): void {
    this.routesSubject.next(routes);
  }

  currentRoutes(): SchoolRouteEntity[] {
    return this.routesSubject.value;
  }

  setStatus(status: RouteStatusFilter): void {
    this.statusSubject.next(status);
  }

  setSearchTerm(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }
}
