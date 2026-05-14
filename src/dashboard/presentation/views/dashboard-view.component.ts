import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../application/services/mock-data.service';
import { MapViewComponent } from '../components/map-view/map-view.component';
import { AlertsWidgetComponent } from '../components/alerts-widget/alerts-widget.component';
import { CompanyMetricsComponent } from '../components/company-metrics/company-metrics.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

type Role = 'operator' | 'company' | 'admin';

@Component({
    selector: 'app-dashboard-view',
    standalone: true,
    imports: [
        CommonModule,
        MapViewComponent,
        AlertsWidgetComponent,
        CompanyMetricsComponent,
        MatButtonToggleModule,
        MatIconModule
    ],
    template: `
    <div class="dashboard-container">
      <!-- Selector de rol -->
      <div class="role-selector">
        <mat-button-toggle-group [value]="selectedRole()" (change)="changeRole($event.value)">
          <mat-button-toggle value="operator">
            <mat-icon>person</mat-icon> Conductor
          </mat-button-toggle>
          <mat-button-toggle value="company">
            <mat-icon>business</mat-icon> Empresa
          </mat-button-toggle>
          <mat-button-toggle value="admin">
            <mat-icon>admin_panel_settings</mat-icon> Administrador
          </mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      <!-- Contenido según rol -->
      <div *ngIf="selectedRole() === 'company'">
        <app-company-metrics [metrics]="mockData.getCompanyMetrics()" />
      </div>

      <app-map-view [vehicles]="vehicles()" />
      <app-alerts-widget [alerts]="alerts()" />

      <div *ngIf="selectedRole() === 'operator'" class="info-message">
        <mat-icon>info</mat-icon> Vista de conductor: Aquí aparecerían detalles de tu ruta personal.
      </div>
      <div *ngIf="selectedRole() === 'admin'" class="info-message">
        <mat-icon>public</mat-icon> Vista de administrador: Monitoreo global de todas las empresas.
      </div>
    </div>
  `,
    styles: [`
    .dashboard-container { padding: 1rem; }
    .role-selector { display: flex; justify-content: flex-end; margin-bottom: 1.5rem; }
    .info-message { margin-top: 1rem; padding: 1rem; background: #e3f2fd; border-radius: 8px; display: flex; align-items: center; gap: 8px; }
  `]
})
export class DashboardViewComponent {
    mockData = new MockDataService(); // o inyectar con inject
    selectedRole = signal<Role>('company');
    vehicles = signal<any[]>([]);
    alerts = signal<any[]>([]);

    constructor() {
        this.loadRoleData('company');
    }

    changeRole(role: Role) {
        this.selectedRole.set(role);
        this.loadRoleData(role);
    }

    private loadRoleData(role: Role) {
        this.vehicles.set(this.mockData.getVehicles(role));
        this.alerts.set(this.mockData.getAlerts(role));
    }
}