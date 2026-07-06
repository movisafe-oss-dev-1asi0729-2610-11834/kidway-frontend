import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { RouteFacadeService } from '../../../application/services/route-facade.service';
import { RouteFilterState, RouteStatusFilter } from '../../../application/state/route-filter.state';
import { SchoolRouteEntity } from '../../../domain/entities/school-route.entity';
import { RouteKpiCardComponent } from '../../components/route-kpi-card/route-kpi-card.component';
import { RouteMapPanelComponent } from '../../components/route-map-panel/route-map-panel.component';
import { RouteReadinessPanelComponent } from '../../components/route-readiness-panel/route-readiness-panel.component';
import { RouteStatusCardComponent } from '../../components/route-status-card/route-status-card.component';

@Component({
  selector: 'kw-route-management-page',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    FormsModule,
    MatIconModule,
    TranslateModule,
    RouteKpiCardComponent,
    RouteMapPanelComponent,
    RouteReadinessPanelComponent,
    RouteStatusCardComponent
  ],
  templateUrl: './route-management-page.component.html',
  styleUrl: './route-management-page.component.css'
})
export class RouteManagementPageComponent {
  private readonly facade = inject(RouteFacadeService);
  protected readonly filters = inject(RouteFilterState);
  protected readonly dashboard$ = this.facade.loadDashboard();
  protected readonly statusFilters: RouteStatusFilter[] = ['all', 'active', 'scheduled', 'review', 'inactive'];

  protected readonly selectedRoute = signal<SchoolRouteEntity | null>(null);
  protected readonly showCreateRoute = signal(false);
  protected readonly routeDraft: SchoolRouteEntity = {
    id: '',
    code: 'RT-000',
    name: 'New School Route',
    district: 'Lima',
    school: 'School name',
    scheduleLabel: 'Morning service',
    startTime: '06:45',
    endTime: '07:45',
    assignedDriver: 'Pending',
    assignedVehicle: 'Pending',
    assignedStudents: 0,
    vehicleCapacity: 15,
    stops: 8,
    coveragePercentage: 90,
    optimizationScore: 88,
    estimatedDuration: '60 min',
    status: 'scheduled',
    nextServiceAt: new Date().toISOString(),
    lastOptimizedAt: new Date().toISOString().slice(0, 10),
    needsOptimization: false,
    checkpoints: ['Pickup point', 'School gate']
  };

  setStatus(status: RouteStatusFilter): void {
    this.filters.setStatus(status);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filters.setSearchTerm(input.value);
  }


  openCreateRoute(): void {
    this.showCreateRoute.set(true);
  }

  closeCreateRoute(): void {
    this.showCreateRoute.set(false);
  }

  saveRoute(): void {
    const route: SchoolRouteEntity = {
      ...this.routeDraft,
      id: `route-${Date.now()}`,
      code: this.routeDraft.code || `RT-${String(Date.now()).slice(-3)}`,
      assignedStudents: Number(this.routeDraft.assignedStudents) || 0,
      vehicleCapacity: Number(this.routeDraft.vehicleCapacity) || 1,
      stops: Number(this.routeDraft.stops) || 1,
      coveragePercentage: Number(this.routeDraft.coveragePercentage) || 90,
      optimizationScore: Number(this.routeDraft.optimizationScore) || 88,
      needsOptimization: Number(this.routeDraft.optimizationScore) < 80
    };
    this.filters.setRoutes([route, ...this.filters.currentRoutes()]);
    this.selectedRoute.set(route);
    this.showCreateRoute.set(false);
  }

  openRouteDetails(route: SchoolRouteEntity): void {
    this.selectedRoute.set(route);
  }

  closeRouteDetails(): void {
    this.selectedRoute.set(null);
  }

  exportList(): void {
    const routes = this.filters.currentRoutes();
    const header = ['Code', 'Route', 'District', 'School', 'Driver', 'Vehicle', 'Students', 'Stops', 'Status'];
    const rows = routes.map((route) => [
      route.code,
      route.name,
      route.district,
      route.school,
      route.assignedDriver,
      route.assignedVehicle,
      `${route.assignedStudents}/${route.vehicleCapacity}`,
      route.stops,
      route.status
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kidway-route-registry.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  statusIcon(status: RouteStatusFilter): string {
    const icons: Record<RouteStatusFilter, string> = {
      all: 'account_tree',
      active: 'play_circle',
      scheduled: 'event_available',
      review: 'manage_search',
      inactive: 'block'
    };
    return icons[status];
  }

  capacityUsage(route: SchoolRouteEntity): number {
    if (!route.vehicleCapacity) return 0;
    return Math.min(100, Math.round((route.assignedStudents / route.vehicleCapacity) * 100));
  }
}
