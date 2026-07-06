import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { AttendanceFacadeService } from '../../../application/services/attendance-facade.service';
import { AttendanceFilterState } from '../../../application/state/attendance-filter.state';
import { AttendanceRecordEntity } from '../../../domain/entities/attendance-record.entity';
import { AttendanceDashboardModel } from '../../../domain/models/attendance-dashboard.model';
import { AttendanceStatus, AttendanceStatusFilter } from '../../../domain/models/attendance-status.type';
import { AttendanceDetailDialogComponent } from '../../components/attendance-detail-dialog/attendance-detail-dialog.component';
import { AttendanceKpiCardComponent } from '../../components/attendance-kpi-card/attendance-kpi-card.component';
import { AttendanceReadinessPanelComponent } from '../../components/attendance-readiness-panel/attendance-readiness-panel.component';
import { AttendanceStatusCardComponent } from '../../components/attendance-status-card/attendance-status-card.component';

@Component({
  selector: 'kw-attendance-management-page',
  standalone: true,
  imports: [
    AsyncPipe,
    MatIconModule,
    TranslateModule,
    AttendanceKpiCardComponent,
    AttendanceStatusCardComponent,
    AttendanceReadinessPanelComponent
  ],
  templateUrl: './attendance-management-page.component.html',
  styleUrl: './attendance-management-page.component.css'
})
export class AttendanceManagementPageComponent {
  private readonly facade = inject(AttendanceFacadeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly dashboardSubject = new BehaviorSubject<AttendanceDashboardModel | null>(null);

  protected readonly filters = inject(AttendanceFilterState);
  protected readonly dashboard$ = this.dashboardSubject.asObservable();
  protected readonly statusFilters: AttendanceStatusFilter[] = ['all', 'waiting', 'on_board', 'arrived', 'absent', 'pending_confirmation'];

  constructor() {
    this.facade.loadDashboard().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((dashboard) => {
      this.dashboardSubject.next(dashboard);
      this.filters.setRecords(dashboard.records);
    });
  }

  setStatus(status: AttendanceStatusFilter): void {
    this.filters.setStatus(status);
  }

  setRoute(route: string): void {
    this.filters.setRoute(route);
  }

  onSearch(event: Event): void {
    this.filters.setSearchTerm((event.target as HTMLInputElement).value);
  }

  viewDetail(record: AttendanceRecordEntity): void {
    this.dialog.open<AttendanceDetailDialogComponent, AttendanceRecordEntity>(AttendanceDetailDialogComponent, {
      data: record,
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'kidway-dialog-panel'
    });
  }

  changeStatus(event: { record: AttendanceRecordEntity; status: AttendanceStatus }): void {
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const updates: Partial<AttendanceRecordEntity> = {
      status: event.status,
      checkInTime: event.status === 'on_board' || event.status === 'arrived' ? event.record.checkInTime ?? now : event.record.checkInTime,
      dropOffTime: event.status === 'arrived' ? now : event.status === 'on_board' ? null : event.record.dropOffTime,
      reliability: event.status === 'arrived' ? 100 : event.status === 'on_board' ? Math.max(event.record.reliability, 80) : event.status === 'absent' ? 0 : event.record.reliability,
      lastEvent: this.statusActivityTitle(event.status),
      notes: this.statusActivityDescription(event.record, event.status)
    };
    this.updateRecord({ ...event.record, ...updates }, this.statusActivityTitle(event.status), this.statusActivityDescription(event.record, event.status), event.status === 'absent' || event.status === 'pending_confirmation' ? 'pending' : 'completed');
  }

  exportAttendance(records: AttendanceRecordEntity[]): void {
    const header = ['Student', 'Code', 'Route', 'Vehicle', 'Driver', 'Status', 'Check-in', 'Drop-off', 'ETA'];
    const rows = records.map((record) => [record.studentName, record.studentCode, record.routeName, record.vehiclePlate, record.driverName, record.status, record.checkInTime ?? '', record.dropOffTime ?? '', record.estimatedArrival]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'kidway-attendance-registry.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  statusLabel(status: AttendanceStatusFilter): string {
    const labels: Record<AttendanceStatusFilter, string> = {
      all: 'All records',
      waiting: 'Waiting',
      on_board: 'On board',
      arrived: 'Arrived',
      absent: 'Absent',
      pending_confirmation: 'Review'
    };
    return labels[status];
  }

  statusIcon(status: AttendanceStatusFilter): string {
    const icons: Record<AttendanceStatusFilter, string> = {
      all: 'fact_check',
      waiting: 'location_on',
      on_board: 'directions_bus',
      arrived: 'where_to_vote',
      absent: 'cancel',
      pending_confirmation: 'pending_actions'
    };
    return icons[status];
  }

  private updateRecord(record: AttendanceRecordEntity, title: string, description: string, status: 'completed' | 'active' | 'pending'): void {
    const current = this.dashboardSubject.value;
    if (!current) return;
    const records = current.records.map((item) => (item.id === record.id ? record : item));
    const dashboard: AttendanceDashboardModel = {
      ...current,
      records,
      summary: this.summaryFrom(records),
      activities: [{ id: `attendance-activity-${Date.now()}`, time: 'Now', title, description, status }, ...current.activities]
    };
    this.dashboardSubject.next(dashboard);
    this.filters.setRecords(records);
  }

  private summaryFrom(records: AttendanceRecordEntity[]) {
    const totalAssigned = records.length;
    const onBoard = records.filter((record) => record.status === 'on_board').length;
    const arrived = records.filter((record) => record.status === 'arrived').length;
    const waiting = records.filter((record) => record.status === 'waiting').length;
    const absent = records.filter((record) => record.status === 'absent').length;
    const pendingConfirmation = records.filter((record) => record.status === 'pending_confirmation').length;
    const attended = onBoard + arrived;
    return {
      totalAssigned,
      onBoard,
      arrived,
      waiting,
      absent,
      pendingConfirmation,
      attendanceReliability: Math.round((attended / Math.max(totalAssigned - pendingConfirmation, 1)) * 1000) / 10
    };
  }

  private statusActivityTitle(status: AttendanceStatus): string {
    const titles: Record<AttendanceStatus, string> = {
      waiting: 'Student marked as waiting',
      on_board: 'Boarding confirmed',
      arrived: 'Drop-off confirmed',
      absent: 'Absence registered',
      pending_confirmation: 'Attendance review requested'
    };
    return titles[status];
  }

  private statusActivityDescription(record: AttendanceRecordEntity, status: AttendanceStatus): string {
    const descriptions: Record<AttendanceStatus, string> = {
      waiting: `${record.studentName} is waiting at ${record.pickupPoint}.`,
      on_board: `${record.studentName} boarded vehicle ${record.vehiclePlate}.`,
      arrived: `${record.studentName} arrived at ${record.school}.`,
      absent: `${record.studentName} was marked as absent and requires guardian awareness.`,
      pending_confirmation: `${record.studentName} needs attendance confirmation before route closure.`
    };
    return descriptions[status];
  }
}
