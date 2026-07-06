import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    NgClass,
    FormsModule,
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

  protected readonly selectedVehicle = signal<VehicleEntity | null>(null);
  protected readonly showRegisterVehicle = signal(false);
  protected readonly vehicleDraft: VehicleEntity = {
    id: '',
    plate: 'NEW-000',
    code: 'KW-000',
    brand: 'Toyota',
    model: 'Hiace',
    year: new Date().getFullYear(),
    capacity: 15,
    assignedStudents: 0,
    driverName: 'Not assigned',
    routeName: 'Backup unit',
    status: 'available',
    energyType: 'gasoline',
    ownershipType: 'company',
    nextMaintenanceDate: new Date().toISOString().slice(0, 10),
    lastInspectionDate: new Date().toISOString().slice(0, 10),
    mileageKm: 0,
    availabilityScore: 90,
    documentsValid: true
  };

  setStatus(status: FleetStatusFilter): void {
    this.filters.setStatus(status);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filters.setSearchTerm(input.value);
  }


  openRegisterVehicle(): void {
    this.showRegisterVehicle.set(true);
  }

  closeRegisterVehicle(): void {
    this.showRegisterVehicle.set(false);
  }

  saveVehicle(): void {
    const vehicle: VehicleEntity = {
      ...this.vehicleDraft,
      id: `veh-${Date.now()}`,
      code: this.vehicleDraft.code || this.vehicleDraft.plate,
      assignedStudents: Number(this.vehicleDraft.assignedStudents) || 0,
      capacity: Number(this.vehicleDraft.capacity) || 1,
      year: Number(this.vehicleDraft.year) || new Date().getFullYear(),
      mileageKm: Number(this.vehicleDraft.mileageKm) || 0,
      availabilityScore: Number(this.vehicleDraft.availabilityScore) || 90
    };
    this.facade.createVehicle(vehicle).subscribe({
      next: (created) => {
        this.selectedVehicle.set(created);
        this.showRegisterVehicle.set(false);
      },
      error: () => {
        this.filters.setVehicles([vehicle, ...this.filters.vehicles()]);
        this.selectedVehicle.set(vehicle);
        this.showRegisterVehicle.set(false);
      }
    });
  }

  openVehicleDetails(vehicle: VehicleEntity): void {
    this.selectedVehicle.set(vehicle);
  }

  closeVehicleDetails(): void {
    this.selectedVehicle.set(null);
  }

  exportList(): void {
    const header = ['Code', 'Plate', 'Brand', 'Model', 'Driver', 'Route', 'Status', 'Capacity', 'Inspection'];
    const rows = this.filters.filteredVehicles().map((vehicle) => [
      vehicle.code,
      vehicle.plate,
      vehicle.brand,
      vehicle.model,
      vehicle.driverName,
      vehicle.routeName,
      vehicle.status,
      `${vehicle.assignedStudents}/${vehicle.capacity}`,
      vehicle.lastInspectionDate
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kidway-fleet-registry.csv';
    link.click();
    URL.revokeObjectURL(url);
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
