import { AsyncPipe, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { FleetFacadeService } from '../../../application/services/fleet-facade.service';
import { FleetFilterState, FleetStatusFilter } from '../../../application/state/fleet-filter.state';
import { VehicleEntity } from '../../../domain/entities/vehicle.entity';
import { FleetKpiCardComponent } from '../../components/fleet-kpi-card/fleet-kpi-card.component';
import { FleetMaintenancePanelComponent } from '../../components/fleet-maintenance-panel/fleet-maintenance-panel.component';
import { VehicleStatusCardComponent } from '../../components/vehicle-status-card/vehicle-status-card.component';

@Component({
  selector: 'kw-fleet-management-page',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    DecimalPipe,
    NgClass,
    MatIconModule,
    TranslateModule,
    FleetKpiCardComponent,
    FleetMaintenancePanelComponent,
    VehicleStatusCardComponent
  ],
  templateUrl: './fleet-management-page.component.html',
  styleUrl: './fleet-management-page.component.css'
})
export class FleetManagementPageComponent {
  private readonly facade = inject(FleetFacadeService);
  protected readonly filters = inject(FleetFilterState);
  protected readonly dashboard$ = this.facade.loadDashboard();

  protected readonly statusFilters: FleetStatusFilter[] = ['all', 'available', 'onRoute', 'maintenance', 'inactive'];

  setStatus(status: FleetStatusFilter): void {
    this.filters.setStatus(status);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filters.setSearchTerm(input.value);
  }

  capacityUsage(vehicle: VehicleEntity): number {
    if (!vehicle.capacity) return 0;
    return Math.min(Math.round((vehicle.assignedStudents / vehicle.capacity) * 100), 100);
  }

  availabilityGradient(value: number): string {
    const safeValue = Math.max(0, Math.min(value, 100));
    return `conic-gradient(var(--kw-blue-700) ${safeValue}%, #e9eff7 0)`;
  }

  statusIcon(status: string): string {
    const icons: Record<string, string> = {
      available: 'check_circle',
      onRoute: 'route',
      maintenance: 'build_circle',
      inactive: 'block'
    };
    return icons[status] ?? 'directions_bus';
  }
}
