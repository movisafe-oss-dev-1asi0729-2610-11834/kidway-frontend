import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { TripEntity } from '../../domain/entities/trip.entity';
import { TripShift } from '../../domain/models/trip-shift.type';
import { TripStatus } from '../../domain/models/trip-status.type';

export type TripStatusFilter = 'all' | TripStatus;
export type TripShiftFilter = 'all' | TripShift;

@Injectable({ providedIn: 'root' })
export class TripFilterState {
  private readonly tripsSubject = new BehaviorSubject<TripEntity[]>([]);
  private readonly searchTermSubject = new BehaviorSubject<string>('');
  private readonly statusSubject = new BehaviorSubject<TripStatusFilter>('all');
  private readonly shiftSubject = new BehaviorSubject<TripShiftFilter>('all');

  readonly status$ = this.statusSubject.asObservable();
  readonly shift$ = this.shiftSubject.asObservable();
  readonly filteredTrips$ = combineLatest([
    this.tripsSubject,
    this.searchTermSubject,
    this.statusSubject,
    this.shiftSubject
  ]).pipe(
    map(([trips, term, status, shift]) => {
      const normalized = term.trim().toLowerCase();
      return trips.filter((trip) => {
        const matchesStatus = status === 'all' || trip.status === status;
        const matchesShift = shift === 'all' || trip.shift === shift;
        const searchable = [
          trip.code,
          trip.routeName,
          trip.vehiclePlate,
          trip.driverName,
          trip.school,
          trip.district,
          trip.nextStop,
          trip.status,
          trip.shift
        ]
          .join(' ')
          .toLowerCase();
        return matchesStatus && matchesShift && searchable.includes(normalized);
      });
    })
  );

  setTrips(trips: TripEntity[]): void {
    this.tripsSubject.next(trips);
  }

  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }

  setStatus(status: TripStatusFilter): void {
    this.statusSubject.next(status);
  }

  setShift(shift: TripShiftFilter): void {
    this.shiftSubject.next(shift);
  }
}
