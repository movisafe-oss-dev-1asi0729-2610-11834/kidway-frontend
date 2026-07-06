import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { AssignmentEntity } from '../../domain/entities/assignment.entity';
import { AssignmentStatus } from '../../domain/models/assignment-status.type';

export type AssignmentStatusFilter = AssignmentStatus | 'all';
export type AssignmentShiftFilter = 'morning' | 'afternoon' | 'all';

@Injectable({ providedIn: 'root' })
export class AssignmentFilterState {
  private readonly assignmentsSubject = new BehaviorSubject<AssignmentEntity[]>([]);
  private readonly statusSubject = new BehaviorSubject<AssignmentStatusFilter>('all');
  private readonly shiftSubject = new BehaviorSubject<AssignmentShiftFilter>('all');
  private readonly searchSubject = new BehaviorSubject<string>('');

  readonly selectedStatus$ = this.statusSubject.asObservable();
  readonly selectedShift$ = this.shiftSubject.asObservable();

  readonly filteredAssignments$ = combineLatest([
    this.assignmentsSubject,
    this.statusSubject,
    this.shiftSubject,
    this.searchSubject
  ]).pipe(
    map(([assignments, status, shift, search]) => {
      const normalizedSearch = search.trim().toLowerCase();

      return assignments.filter((assignment) => {
        const matchesStatus = status === 'all' || assignment.status === status;
        const matchesShift = shift === 'all' || assignment.shift === shift;
        const matchesSearch =
          !normalizedSearch ||
          [
            assignment.id,
            assignment.studentCode,
            assignment.studentName,
            assignment.guardianName,
            assignment.routeCode,
            assignment.routeName,
            assignment.vehiclePlate,
            assignment.driverName,
            assignment.pickupPoint,
            assignment.grade
          ]
            .join(' ')
            .toLowerCase()
            .includes(normalizedSearch);

        return matchesStatus && matchesShift && matchesSearch;
      });
    })
  );

  setAssignments(assignments: AssignmentEntity[]): void {
    this.assignmentsSubject.next(assignments);
  }

  setStatus(status: AssignmentStatusFilter): void {
    this.statusSubject.next(status);
  }

  setShift(shift: AssignmentShiftFilter): void {
    this.shiftSubject.next(shift);
  }

  setSearchTerm(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }
}
