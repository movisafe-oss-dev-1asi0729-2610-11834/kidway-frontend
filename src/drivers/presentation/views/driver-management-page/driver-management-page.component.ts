import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { DriverFacadeService } from '../../../application/services/driver-facade.service';
import { DriverFilterState, DriverStatusFilter } from '../../../application/state/driver-filter.state';
import { DriverEntity } from '../../../domain/entities/driver.entity';
import { DriverKpiCardComponent } from '../../components/driver-kpi-card/driver-kpi-card.component';
import { DriverStatusCardComponent } from '../../components/driver-status-card/driver-status-card.component';
import { DriverCompliancePanelComponent } from '../../components/driver-compliance-panel/driver-compliance-panel.component';

@Component({
  selector: 'kw-driver-management-page',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    NgClass,
    FormsModule,
    MatIconModule,
    TranslateModule,
    DriverKpiCardComponent,
    DriverStatusCardComponent,
    DriverCompliancePanelComponent
  ],
  templateUrl: './driver-management-page.component.html',
  styleUrl: './driver-management-page.component.css'
})
export class DriverManagementPageComponent {
  private readonly facade = inject(DriverFacadeService);
  protected readonly filters = inject(DriverFilterState);
  protected readonly dashboard$ = this.facade.loadDashboard();
  protected readonly statusFilters: DriverStatusFilter[] = ['all', 'available', 'onRoute', 'review', 'offDuty'];

  protected readonly selectedDriver = signal<DriverEntity | null>(null);
  protected readonly showRegisterDriver = signal(false);
  protected readonly driverDraft: DriverEntity = {
    id: '',
    code: 'DRV-000',
    fullName: 'New Driver',
    photoInitials: 'ND',
    licenseNumber: 'AIIb-000000',
    licenseClass: 'A-IIb',
    licenseExpiresAt: '2027-12-31',
    phone: '+51 900 000 000',
    email: 'driver@kidway.pe',
    assignedVehicle: 'Not assigned',
    assignedRoute: 'Not assigned',
    status: 'available',
    availabilityLabel: 'Ready for assignment',
    tripsToday: 0,
    studentsAssigned: 0,
    safetyScore: 90,
    punctualityScore: 90,
    lastCheckIn: new Date().toISOString(),
    documentsValid: true,
    yearsOfExperience: 1
  };

  setStatus(status: DriverStatusFilter): void {
    this.filters.setStatus(status);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filters.setSearchTerm(input.value);
  }


  openRegisterDriver(): void {
    this.showRegisterDriver.set(true);
  }

  closeRegisterDriver(): void {
    this.showRegisterDriver.set(false);
  }

  saveDriver(): void {
    const names = this.driverDraft.fullName.trim().split(/\s+/);
    const initials = names.slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase() || 'ND';
    const driver: DriverEntity = {
      ...this.driverDraft,
      id: `drv-${Date.now()}`,
      code: this.driverDraft.code || `DRV-${String(Date.now()).slice(-3)}`,
      photoInitials: initials,
      tripsToday: Number(this.driverDraft.tripsToday) || 0,
      studentsAssigned: Number(this.driverDraft.studentsAssigned) || 0,
      safetyScore: Number(this.driverDraft.safetyScore) || 90,
      punctualityScore: Number(this.driverDraft.punctualityScore) || 90,
      yearsOfExperience: Number(this.driverDraft.yearsOfExperience) || 1
    };
    this.facade.createDriver(driver).subscribe({
      next: (created) => {
        this.selectedDriver.set(created);
        this.showRegisterDriver.set(false);
      },
      error: () => {
        this.filters.setDrivers([driver, ...this.filters.drivers()]);
        this.selectedDriver.set(driver);
        this.showRegisterDriver.set(false);
      }
    });
  }

  openDriverDetails(driver: DriverEntity): void {
    this.selectedDriver.set(driver);
  }

  closeDriverDetails(): void {
    this.selectedDriver.set(null);
  }

  exportList(): void {
    const header = ['Code', 'Driver', 'License', 'Vehicle', 'Route', 'Status', 'Safety', 'Punctuality'];
    const rows = this.filters.filteredDrivers().map((driver) => [
      driver.code,
      driver.fullName,
      driver.licenseNumber,
      driver.assignedVehicle,
      driver.assignedRoute,
      driver.status,
      `${driver.safetyScore}%`,
      `${driver.punctualityScore}%`
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kidway-driver-registry.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  readinessGradient(value: number): string {
    const safeValue = Math.max(0, Math.min(value, 100));
    return `conic-gradient(var(--kw-blue-700) ${safeValue}%, #e9eff7 0)`;
  }

  statusIcon(status: string): string {
    const icons: Record<string, string> = {
      available: 'check_circle',
      onRoute: 'route',
      review: 'manage_search',
      offDuty: 'bedtime',
      all: 'groups'
    };
    return icons[status] ?? 'badge';
  }

  scoreWidth(driver: DriverEntity): number {
    return Math.max(0, Math.min(driver.punctualityScore, 100));
  }
}
