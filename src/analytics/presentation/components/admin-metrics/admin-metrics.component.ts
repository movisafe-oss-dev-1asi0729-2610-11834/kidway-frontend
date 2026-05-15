import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MockAnalyticsService } from '../../../application/services/mock-analytics.service';
import { GlobalMetrics } from '../../../domain/models/analytics.model';

@Component({
    selector: 'app-admin-metrics',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule],
    template: `
    <div class="admin-metrics">
      <h2>Métricas globales del sistema</h2>
      <div class="metrics-grid">
        <mat-card>
          <mat-icon>business</mat-icon>
          <div class="value">{{ metrics.totalCompanies }}</div>
          <div class="label">Empresas</div>
        </mat-card>
        <mat-card>
          <mat-icon>badge</mat-icon>
          <div class="value">{{ metrics.totalDrivers }}</div>
          <div class="label">Conductores</div>
        </mat-card>
        <mat-card>
          <mat-icon>directions_bus</mat-icon>
          <div class="value">{{ metrics.totalVehicles }}</div>
          <div class="label">Vehículos</div>
        </mat-card>
        <mat-card>
          <mat-icon>route</mat-icon>
          <div class="value">{{ metrics.totalRoutes }}</div>
          <div class="label">Rutas</div>
        </mat-card>
        <mat-card>
          <mat-icon>warning</mat-icon>
          <div class="value">{{ metrics.activeIncidents }}</div>
          <div class="label">Incidentes activos</div>
        </mat-card>
        <mat-card [class]="metrics.systemHealth">
          <mat-icon>health_and_safety</mat-icon>
          <div class="value">{{ systemHealthLabel }}</div>
          <div class="label">Salud del sistema</div>
        </mat-card>
      </div>
    </div>
  `,
    styles: [`
    .admin-metrics { padding: 1rem; }
    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem; }
    mat-card { text-align: center; padding: 1.5rem; transition: transform 0.2s; }
    mat-card:hover { transform: translateY(-5px); }
    mat-icon { font-size: 2.5rem; height: auto; width: auto; color: #3f51b5; }
    .value { font-size: 2rem; font-weight: bold; margin: 0.5rem 0; }
    .label { font-size: 0.9rem; color: rgba(0,0,0,0.6); }
    .healthy { border-left: 5px solid green; }
    .degraded { border-left: 5px solid orange; }
    .down { border-left: 5px solid red; }
  `]
})
export class AdminMetricsComponent {
    private analyticsService = inject(MockAnalyticsService);
    metrics: GlobalMetrics = this.analyticsService.getGlobalMetrics();

    get systemHealthLabel(): string {
        switch (this.metrics.systemHealth) {
            case 'healthy': return 'Óptimo';
            case 'degraded': return 'Degradado';
            case 'down': return 'Fuera de servicio';
        }
    }
}