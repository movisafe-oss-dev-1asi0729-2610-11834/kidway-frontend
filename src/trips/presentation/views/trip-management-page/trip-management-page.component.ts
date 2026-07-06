import { AsyncPipe, NgClass } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { TripFacadeService } from '../../../application/services/trip-facade.service';
import { TripFilterState, TripShiftFilter, TripStatusFilter } from '../../../application/state/trip-filter.state';
import { TripEntity } from '../../../domain/entities/trip.entity';
import { TripShift } from '../../../domain/models/trip-shift.type';
import { TripStatus } from '../../../domain/models/trip-status.type';
import { TripDashboardModel } from '../../../domain/models/trip-dashboard.model';
import { TripKpiCardComponent } from '../../components/trip-kpi-card/trip-kpi-card.component';
import { TripReadinessPanelComponent } from '../../components/trip-readiness-panel/trip-readiness-panel.component';
import { TripStatusCardComponent } from '../../components/trip-status-card/trip-status-card.component';
import { TripDetailDialogComponent } from '../../components/trip-detail-dialog/trip-detail-dialog.component';
import { TripFormDialogComponent, TripFormResult } from '../../components/trip-form-dialog/trip-form-dialog.component';

@Component({
  selector: 'kw-trip-management-page',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    MatIconModule,
    TranslateModule,
    TripKpiCardComponent,
    TripStatusCardComponent,
    TripReadinessPanelComponent
  ],
  templateUrl: './trip-management-page.component.html',
  styleUrl: './trip-management-page.component.css'
})
export class TripManagementPageComponent {
  private readonly facade = inject(TripFacadeService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dashboardSubject = new BehaviorSubject<TripDashboardModel | null>(null);

  protected readonly filters = inject(TripFilterState);
  protected readonly dashboard$ = this.dashboardSubject.asObservable();
  protected readonly statusFilters: TripStatusFilter[] = ['all', 'scheduled', 'in_progress', 'delayed', 'completed', 'canceled'];
  protected readonly shiftFilters: TripShiftFilter[] = ['all', 'morning', 'afternoon', 'return'];

  constructor() {
    this.facade
      .loadDashboard()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((dashboard) => {
        this.dashboardSubject.next(dashboard);
        this.filters.setTrips(dashboard.trips);
      });
  }

  setStatus(status: TripStatusFilter): void {
    this.filters.setStatus(status);
  }

  setShift(shift: TripShiftFilter): void {
    this.filters.setShift(shift);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filters.setSearchTerm(input.value);
  }

  openCreateTrip(): void {
    const dialogRef = this.dialog.open<TripFormDialogComponent, TripEntity | null, TripFormResult>(
      TripFormDialogComponent,
      {
        data: null,
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
        this.appendTrip(this.buildTripFromForm(result));
      });
  }

  openEditTrip(trip: TripEntity): void {
    const dialogRef = this.dialog.open<TripFormDialogComponent, TripEntity, TripFormResult>(
      TripFormDialogComponent,
      {
        data: trip,
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
        this.updateTrip({ ...trip, ...this.patchTripFromForm(result, trip) });
      });
  }

  openTripDetails(trip: TripEntity): void {
    this.dialog.open<TripDetailDialogComponent, TripEntity>(TripDetailDialogComponent, {
      data: trip,
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'kidway-dialog-panel'
    });
  }

  startTrip(trip: TripEntity): void {
    this.updateTrip({
      ...trip,
      status: 'in_progress',
      progress: Math.max(trip.progress, 8),
      trackingStatus: 'enabled',
      validationMessage: 'Trip started and live tracking enabled.',
      updatedAt: 'Now'
    }, 'Trip started', `${trip.routeName} started with vehicle ${trip.vehiclePlate}.`, 'active');
  }

  completeTrip(trip: TripEntity): void {
    this.updateTrip({
      ...trip,
      status: 'completed',
      progress: 100,
      completedStops: trip.totalStops,
      actualEndTime: trip.estimatedEndTime,
      trackingStatus: 'closed',
      validationMessage: 'Trip completed and operation history stored.',
      updatedAt: 'Now'
    }, 'Trip completed', `${trip.routeName} was completed and tracking session was closed.`, 'completed');
  }

  cancelTrip(trip: TripEntity): void {
    this.updateTrip({
      ...trip,
      status: 'canceled',
      trackingStatus: 'blocked',
      validationMessage: 'Trip canceled and attendance records blocked.',
      updatedAt: 'Now'
    }, 'Trip canceled', `${trip.routeName} was canceled before completion.`, 'pending');
  }

  exportTrips(trips: TripEntity[]): void {
    const header = ['Code', 'Route', 'Vehicle', 'Driver', 'Shift', 'Status', 'Students', 'Progress', 'ETA'];
    const rows = trips.map((trip) => [
      trip.code,
      trip.routeName,
      trip.vehiclePlate,
      trip.driverName,
      trip.shift,
      trip.status,
      `${trip.students}/${trip.capacity}`,
      `${trip.progress}%`,
      trip.estimatedEndTime
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'kidway-trip-registry.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  statusIcon(status: TripStatusFilter): string {
    const icons: Record<TripStatusFilter, string> = {
      all: 'route',
      scheduled: 'event_available',
      in_progress: 'play_circle',
      delayed: 'schedule',
      completed: 'check_circle',
      canceled: 'cancel'
    };
    return icons[status];
  }

  shiftIcon(shift: TripShiftFilter): string {
    const icons: Record<TripShiftFilter, string> = {
      all: 'view_day',
      morning: 'wb_sunny',
      afternoon: 'light_mode',
      return: 'keyboard_return'
    };
    return icons[shift];
  }

  private appendTrip(trip: TripEntity): void {
    const current = this.dashboardSubject.value;
    if (!current) return;
    const trips = [trip, ...current.trips];
    const dashboard = this.withTrips(current, trips, 'Trip scheduled', `${trip.routeName} was added to the daily operation.`, 'pending');
    this.dashboardSubject.next(dashboard);
    this.filters.setTrips(trips);
  }

  private updateTrip(trip: TripEntity, title = 'Trip updated', description = `${trip.routeName} was updated.`, status: 'completed' | 'active' | 'pending' = 'completed'): void {
    const current = this.dashboardSubject.value;
    if (!current) return;
    const trips = current.trips.map((item) => (item.id === trip.id ? trip : item));
    const dashboard = this.withTrips(current, trips, title, description, status);
    this.dashboardSubject.next(dashboard);
    this.filters.setTrips(trips);
  }

  private withTrips(
    current: TripDashboardModel,
    trips: TripEntity[],
    title: string,
    description: string,
    status: 'completed' | 'active' | 'pending'
  ): TripDashboardModel {
    return {
      ...current,
      trips,
      summary: this.recalculateSummary(trips),
      activities: [
        {
          id: `trip-activity-${Date.now()}`,
          time: 'Now',
          title,
          description,
          status
        },
        ...current.activities
      ]
    };
  }

  private buildTripFromForm(form: TripFormResult): TripEntity {
    const id = `trip-${Date.now()}`;
    return {
      id,
      code: `TP-${String(Date.now()).slice(-3)}`,
      ...this.patchTripFromForm(form),
      completedStops: form.status === 'completed' ? form.totalStops : 0,
      progress: form.status === 'completed' ? 100 : form.status === 'in_progress' || form.status === 'delayed' ? 35 : 0,
      averageSpeed: form.status === 'scheduled' ? 0 : 30,
      attendanceRate: form.status === 'scheduled' ? 0 : 92,
      incidents: form.status === 'delayed' ? 1 : 0,
      trackingStatus: form.status === 'scheduled' ? 'ready' : form.status === 'completed' ? 'closed' : 'enabled',
      validationMessage: form.status === 'scheduled' ? 'Trip ready for operational validation.' : 'Trip registered in operation control.',
      updatedAt: 'Now'
    };
  }

  private patchTripFromForm(form: TripFormResult, base?: TripEntity): Omit<TripEntity, 'id' | 'code'> {
    return {
      routeName: form.routeName,
      vehiclePlate: form.vehiclePlate,
      driverName: form.driverName,
      school: form.school,
      district: form.district,
      shift: form.shift,
      status: form.status,
      students: Number(form.students),
      capacity: Number(form.capacity),
      startTime: form.startTime,
      estimatedEndTime: form.estimatedEndTime,
      actualEndTime: base?.actualEndTime,
      nextStop: form.nextStop,
      completedStops: base?.completedStops ?? 0,
      totalStops: Number(form.totalStops),
      progress: base?.progress ?? 0,
      averageSpeed: base?.averageSpeed ?? 0,
      attendanceRate: base?.attendanceRate ?? 0,
      incidents: base?.incidents ?? 0,
      trackingStatus: base?.trackingStatus ?? 'ready',
      validationMessage: base?.validationMessage ?? 'Trip ready for operational validation.',
      updatedAt: 'Now'
    };
  }

  private recalculateSummary(trips: TripEntity[]) {
    const completed = trips.filter((trip) => trip.status === 'completed').length;
    const active = trips.filter((trip) => trip.status === 'in_progress' || trip.status === 'delayed').length;
    const scheduled = trips.filter((trip) => trip.status === 'scheduled').length;
    const delayed = trips.filter((trip) => trip.status === 'delayed').length;
    const reliableTrips = trips.filter((trip) => trip.status !== 'delayed' && trip.status !== 'canceled').length;
    return {
      totalTrips: trips.length,
      activeTrips: active,
      scheduledTrips: scheduled,
      delayedTrips: delayed,
      completedTrips: completed,
      serviceReliability: trips.length ? Math.round((reliableTrips / trips.length) * 100) : 0
    };
  }
}
