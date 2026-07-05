import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
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

  setStatus(status: DriverStatusFilter): void {
    this.filters.setStatus(status);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filters.setSearchTerm(input.value);
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
