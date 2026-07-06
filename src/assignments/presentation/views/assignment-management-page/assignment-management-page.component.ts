import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs';
import { AssignmentFacadeService } from '../../../application/services/assignment-facade.service';
import { AssignmentEntity } from '../../../domain/entities/assignment.entity';
import {
  AssignmentDashboardModel,
  FALLBACK_ASSIGNMENT_DASHBOARD
} from '../../../domain/models/assignment-dashboard.model';
import { AssignmentShift, AssignmentStatus } from '../../../domain/models/assignment-status.type';
import {
  AssignmentFormDialogComponent,
  AssignmentFormResult
} from '../../components/assignment-form-dialog/assignment-form-dialog.component';
import { AssignmentDetailDialogComponent } from '../../components/assignment-detail-dialog/assignment-detail-dialog.component';

@Component({
  selector: 'kw-assignment-management-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatDialogModule, TranslateModule],
  templateUrl: './assignment-management-page.component.html',
  styleUrl: './assignment-management-page.component.css'
})
export class AssignmentManagementPageComponent {
  private readonly facade = inject(AssignmentFacadeService);
  private readonly dialog = inject(MatDialog);

  protected readonly dashboard = signal<AssignmentDashboardModel>(FALLBACK_ASSIGNMENT_DASHBOARD);
  protected readonly loading = signal(true);
  protected readonly selectedStatus = signal<AssignmentStatus | 'all'>('all');
  protected readonly selectedShift = signal<AssignmentShift | 'all'>('all');
  protected readonly searchTerm = signal('');

  protected readonly statusFilters: Array<AssignmentStatus | 'all'> = ['all', 'validated', 'pending', 'conflict', 'inactive'];
  protected readonly shiftFilters: Array<AssignmentShift | 'all'> = ['all', 'morning', 'afternoon'];

  protected readonly assignments = computed(() => this.dashboard().assignments);

  protected readonly filteredAssignments = computed(() => {
    const status = this.selectedStatus();
    const shift = this.selectedShift();
    const search = this.searchTerm().trim().toLowerCase();

    return this.assignments().filter((assignment) => {
      const matchesStatus = status === 'all' || assignment.status === status;
      const matchesShift = shift === 'all' || assignment.shift === shift;
      const matchesSearch =
        !search ||
        [
          assignment.id,
          assignment.studentCode,
          assignment.studentName,
          assignment.guardianName,
          assignment.grade,
          assignment.routeCode,
          assignment.routeName,
          assignment.vehiclePlate,
          assignment.driverName,
          assignment.pickupPoint
        ]
          .join(' ')
          .toLowerCase()
          .includes(search);

      return matchesStatus && matchesShift && matchesSearch;
    });
  });

  protected readonly summaryCards = computed(() => {
    const summary = this.dashboard().summary;
    return [
      {
        icon: 'assignment_turned_in',
        titleKey: 'assignments.metrics.total',
        value: summary.totalAssignments,
        descriptionKey: 'assignments.metrics.totalDescription',
        tone: 'blue'
      },
      {
        icon: 'verified_user',
        titleKey: 'assignments.metrics.validated',
        value: summary.validatedAssignments,
        descriptionKey: 'assignments.metrics.validatedDescription',
        tone: 'green'
      },
      {
        icon: 'pending_actions',
        titleKey: 'assignments.metrics.pending',
        value: summary.pendingAssignments,
        descriptionKey: 'assignments.metrics.pendingDescription',
        tone: 'amber'
      },
      {
        icon: 'report_problem',
        titleKey: 'assignments.metrics.conflicts',
        value: summary.conflictsDetected,
        descriptionKey: 'assignments.metrics.conflictsDescription',
        tone: 'red'
      },
      {
        icon: 'groups',
        titleKey: 'assignments.metrics.capacity',
        value: `${summary.averageCapacity}%`,
        descriptionKey: 'assignments.metrics.capacityDescription',
        tone: 'blue'
      }
    ];
  });

  constructor() {
    this.facade
      .loadDashboard()
      .pipe(take(1))
      .subscribe({
        next: (dashboard) => {
          this.dashboard.set(dashboard);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  updateSearch(value: string): void {
    this.searchTerm.set(value);
  }

  selectStatus(status: AssignmentStatus | 'all'): void {
    this.selectedStatus.set(status);
  }

  selectShift(shift: AssignmentShift | 'all'): void {
    this.selectedShift.set(shift);
  }

  openCreateDialog(): void {
    this.dialog
      .open<AssignmentFormDialogComponent, AssignmentEntity | null, AssignmentFormResult>(AssignmentFormDialogComponent, {
        width: '1040px',
        maxWidth: '96vw',
        maxHeight: '90vh',
        data: null,
        autoFocus: false,
        restoreFocus: false,
        panelClass: 'kidway-dialog-panel'
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (!result) {
          return;
        }

        const newAssignment: AssignmentEntity = {
          ...result,
          id: `AS-${String(Date.now()).slice(-4)}`,
          lastUpdated: 'Just now'
        };

        this.setAssignments([newAssignment, ...this.assignments()]);
      });
  }

  openEditDialog(assignment: AssignmentEntity): void {
    this.dialog
      .open<AssignmentFormDialogComponent, AssignmentEntity, AssignmentFormResult>(AssignmentFormDialogComponent, {
        width: '1040px',
        maxWidth: '96vw',
        maxHeight: '90vh',
        data: assignment,
        autoFocus: false,
        restoreFocus: false,
        panelClass: 'kidway-dialog-panel'
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (!result) {
          return;
        }

        const updated: AssignmentEntity = {
          ...assignment,
          ...result,
          id: assignment.id,
          lastUpdated: 'Just now'
        };

        this.setAssignments(this.assignments().map((item) => (item.id === assignment.id ? updated : item)));
      });
  }

  openDetailDialog(assignment: AssignmentEntity): void {
    this.dialog.open(AssignmentDetailDialogComponent, {
      width: '860px',
      maxWidth: '96vw',
      maxHeight: '90vh',
      data: assignment,
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'kidway-dialog-panel'
    });
  }

  markValidated(assignment: AssignmentEntity): void {
    const updated: AssignmentEntity = {
      ...assignment,
      status: 'validated',
      validation: 'ready',
      validationScore: Math.max(assignment.validationScore, 91),
      lastUpdated: 'Just now'
    };
    this.setAssignments(this.assignments().map((item) => (item.id === assignment.id ? updated : item)));
  }

  removeAssignment(assignment: AssignmentEntity): void {
    this.setAssignments(this.assignments().filter((item) => item.id !== assignment.id));
  }

  exportList(): void {
    const header = ['ID', 'Student', 'Route', 'Vehicle', 'Driver', 'Shift', 'Status', 'Validation Score'];
    const rows = this.filteredAssignments().map((assignment) => [
      assignment.id,
      assignment.studentName,
      assignment.routeName,
      assignment.vehiclePlate,
      assignment.driverName,
      assignment.shift,
      assignment.status,
      `${assignment.validationScore}%`
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kidway-assignment-registry.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  statusLabelKey(status: string): string {
    return `assignments.status.${status}`;
  }

  shiftLabelKey(shift: string): string {
    return `assignments.shift.${shift}`;
  }

  validationLabelKey(validation: string): string {
    return `assignments.validation.${validation}`;
  }

  private setAssignments(assignments: AssignmentEntity[]): void {
    this.dashboard.update((dashboard) => ({
      ...dashboard,
      summary: this.calculateSummary(assignments),
      assignments
    }));
  }

  private calculateSummary(assignments: AssignmentEntity[]) {
    const totalAssignments = assignments.length;
    const validatedAssignments = assignments.filter((assignment) => assignment.status === 'validated').length;
    const pendingAssignments = assignments.filter((assignment) => assignment.status === 'pending').length;
    const conflictsDetected = assignments.filter((assignment) => assignment.status === 'conflict').length;
    const averageCapacity = totalAssignments
      ? Math.round(assignments.reduce((total, item) => total + item.capacityUsage, 0) / totalAssignments)
      : 0;
    const assignmentReadiness = totalAssignments ? Math.round((validatedAssignments / totalAssignments) * 100) : 0;

    return {
      totalAssignments,
      validatedAssignments,
      pendingAssignments,
      conflictsDetected,
      averageCapacity,
      assignmentReadiness
    };
  }
}
