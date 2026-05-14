import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { CompanyReportsComponent } from '../components/company-reports/company-reports.component';
import { AdminMetricsComponent } from '../components/admin-metrics/admin-metrics.component';

type Role = 'company' | 'admin';

@Component({
    selector: 'app-analytics-view',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonToggleModule,
        MatIconModule,
        CompanyReportsComponent,
        AdminMetricsComponent
    ],
    template: `
    <div class="analytics-container">
      <div class="role-selector">
        <mat-button-toggle-group [value]="selectedRole()" (change)="changeRole($event.value)">
          <mat-button-toggle value="company">
            <mat-icon>business</mat-icon> Empresa
          </mat-button-toggle>
          <mat-button-toggle value="admin">
            <mat-icon>admin_panel_settings</mat-icon> Administrador
          </mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      <div *ngIf="selectedRole() === 'company'">
        <app-company-reports />
      </div>
      <div *ngIf="selectedRole() === 'admin'">
        <app-admin-metrics />
      </div>
    </div>
  `,
    styles: [`
    .analytics-container { padding: 1rem; }
    .role-selector { display: flex; justify-content: flex-end; margin-bottom: 1.5rem; }
  `]
})
export class AnalyticsViewComponent {
    selectedRole = signal<Role>('company');

    changeRole(role: Role) {
        this.selectedRole.set(role);
    }
}