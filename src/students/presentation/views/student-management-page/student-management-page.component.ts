import { AsyncPipe, NgClass } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { StudentFacadeService } from '../../../application/services/student-facade.service';
import { StudentFilterState, StudentStatusFilter } from '../../../application/state/student-filter.state';
import { StudentEntity } from '../../../domain/entities/student.entity';
import { StudentDashboardModel } from '../../../domain/models/student-dashboard.model';
import { StudentKpiCardComponent } from '../../components/student-kpi-card/student-kpi-card.component';
import { StudentReadinessPanelComponent } from '../../components/student-readiness-panel/student-readiness-panel.component';
import { StudentStatusCardComponent } from '../../components/student-status-card/student-status-card.component';
import { StudentDetailDialogComponent } from '../../components/student-detail-dialog/student-detail-dialog.component';
import { StudentFormDialogComponent, StudentFormResult } from '../../components/student-form-dialog/student-form-dialog.component';

@Component({
  selector: 'kw-student-management-page',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    MatIconModule,
    TranslateModule,
    StudentKpiCardComponent,
    StudentReadinessPanelComponent,
    StudentStatusCardComponent
  ],
  templateUrl: './student-management-page.component.html',
  styleUrl: './student-management-page.component.css'
})
export class StudentManagementPageComponent {
  private readonly facade = inject(StudentFacadeService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dashboardSubject = new BehaviorSubject<StudentDashboardModel | null>(null);

  protected readonly filters = inject(StudentFilterState);
  protected readonly dashboard$ = this.dashboardSubject.asObservable();
  protected readonly statusFilters: StudentStatusFilter[] = ['all', 'active', 'unassigned', 'review', 'inactive'];

  constructor() {
    this.facade
      .loadDashboard()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((dashboard) => this.dashboardSubject.next(dashboard));
  }

  setStatus(status: StudentStatusFilter): void {
    this.filters.setStatus(status);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filters.setSearchTerm(input.value);
  }

  openRegisterStudent(): void {
    const dialogRef = this.dialog.open<StudentFormDialogComponent, StudentEntity | null, StudentFormResult>(
      StudentFormDialogComponent,
      {
        data: null,
        width: '980px',
        maxWidth: '96vw',
        maxHeight: '90vh',
        autoFocus: false,
        restoreFocus: false,
        panelClass: 'kidway-dialog-panel'
      }
    );

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (!result) return;
        const student = this.buildStudentFromForm(result);
        this.facade.createStudent(student).subscribe({
          next: (created) => this.appendStudent(created),
          error: () => this.appendStudent(student)
        });
      });
  }

  openStudentDetails(student: StudentEntity): void {
    this.dialog.open<StudentDetailDialogComponent, StudentEntity>(StudentDetailDialogComponent, {
      data: student,
      width: '820px',
      maxWidth: '96vw',
      maxHeight: '90vh',
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'kidway-dialog-panel'
    });
  }

  exportStudents(students: StudentEntity[]): void {
    const header = ['Code', 'Student', 'Grade', 'Guardian', 'School', 'Route', 'Status', 'Attendance'];
    const rows = students.map((student) => [
      student.code,
      this.fullName(student),
      student.grade,
      student.guardianName,
      student.school,
      student.routeName ?? 'Unassigned',
      student.status,
      `${student.attendanceRate}%`
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'kidway-student-registry.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  statusIcon(status: StudentStatusFilter): string {
    const icons: Record<StudentStatusFilter, string> = {
      all: 'groups',
      active: 'verified_user',
      unassigned: 'route',
      review: 'manage_search',
      inactive: 'block'
    };
    return icons[status];
  }

  fullName(student: StudentEntity): string {
    return `${student.firstName} ${student.lastName}`;
  }

  private appendStudent(student: StudentEntity): void {
    const current = this.dashboardSubject.value;
    if (!current) return;

    const students = [student, ...current.students];
    const dashboard: StudentDashboardModel = {
      ...current,
      students,
      summary: this.recalculateSummary(students),
      activities: [
        {
          id: `activity-${student.id}`,
          studentName: this.fullName(student),
          title: 'Student record created',
          description: `${this.fullName(student)} was registered and is ready for assignment review.`,
          time: 'Now',
          status: 'completed'
        },
        ...current.activities
      ]
    };

    this.dashboardSubject.next(dashboard);
    this.filters.setStudents(students);
  }

  private buildStudentFromForm(form: StudentFormResult): StudentEntity {
    const id = `student-${Date.now()}`;
    const hasRoute = Boolean(form.routeName);
    const status = hasRoute && form.status === 'unassigned' ? 'active' : form.status;

    return {
      id,
      code: `ST-${String(Math.floor(Math.random() * 900) + 100)}`,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      grade: form.grade.trim(),
      school: form.school.trim(),
      guardianName: form.guardianName.trim(),
      guardianPhone: form.guardianPhone.trim(),
      guardianEmail: form.guardianEmail.trim(),
      emergencyContact: form.emergencyContact.trim(),
      routeName: form.routeName,
      routeCode: hasRoute ? 'RT-PENDING' : null,
      assignedVehicle: hasRoute ? 'Pending assignment' : null,
      assignedDriver: hasRoute ? 'Pending' : null,
      pickupPoint: form.pickupPoint,
      dropOffPoint: null,
      pickupWindow: form.pickupWindow,
      authorizationStatus: 'pending',
      attendanceRate: hasRoute ? 85 : 0,
      lastAttendanceStatus: 'pending',
      status,
      notes: 'New student registered from the frontend base module.'
    };
  }

  private recalculateSummary(students: StudentEntity[]) {
    const totalStudents = students.length;
    const activeStudents = students.filter((student) => student.status === 'active').length;
    const assignedStudents = students.filter((student) => Boolean(student.routeName)).length;
    const unassignedStudents = students.filter((student) => !student.routeName || student.status === 'unassigned').length;
    const guardianVerified = this.safePercentage(
      students.filter((student) => student.authorizationStatus === 'verified').length,
      totalStudents
    );
    const attendanceReliability = Math.round(
      students.reduce((total, student) => total + student.attendanceRate, 0) / Math.max(totalStudents, 1)
    );

    return {
      totalStudents,
      activeStudents,
      assignedStudents,
      unassignedStudents,
      guardianVerified,
      attendanceReliability
    };
  }

  private safePercentage(value: number, total: number): number {
    return Math.round((value / Math.max(total, 1)) * 100);
  }
}
