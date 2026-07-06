import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
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

  setStatus(status: RouteStatusFilter): void {
    this.filters.setStatus(status);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filters.setSearchTerm(input.value);
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
