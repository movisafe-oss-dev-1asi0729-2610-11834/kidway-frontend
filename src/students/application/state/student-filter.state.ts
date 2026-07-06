import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { StudentEntity } from '../../domain/entities/student.entity';
import { StudentStatus } from '../../domain/models/student-status.type';

export type StudentStatusFilter = StudentStatus | 'all';

@Injectable({ providedIn: 'root' })
export class StudentFilterState {
  private readonly studentsSubject = new BehaviorSubject<StudentEntity[]>([]);
  private readonly statusSubject = new BehaviorSubject<StudentStatusFilter>('all');
  private readonly searchSubject = new BehaviorSubject<string>('');

  readonly selectedStatus$ = this.statusSubject.asObservable();

  readonly filteredStudents$ = combineLatest([
    this.studentsSubject,
    this.statusSubject,
    this.searchSubject
  ]).pipe(
    map(([students, status, search]) => {
      const normalizedSearch = search.trim().toLowerCase();

      return students.filter((student) => {
        const matchesStatus = status === 'all' || student.status === status;
        const matchesSearch =
          !normalizedSearch ||
          [
            student.code,
            student.firstName,
            student.lastName,
            student.grade,
            student.school,
            student.guardianName,
            student.routeName ?? '',
            student.assignedVehicle ?? '',
            student.assignedDriver ?? '',
            student.pickupPoint ?? ''
          ]
            .join(' ')
            .toLowerCase()
            .includes(normalizedSearch);

        return matchesStatus && matchesSearch;
      });
    })
  );

  setStudents(students: StudentEntity[]): void {
    this.studentsSubject.next(students);
  }

  setStatus(status: StudentStatusFilter): void {
    this.statusSubject.next(status);
  }

  setSearchTerm(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }
}
