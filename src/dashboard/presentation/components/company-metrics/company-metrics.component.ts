import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CompanyMetrics } from '../../../application/services/mock-data.service';

@Component({
    selector: 'app-company-metrics',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule],
    template: `
    <div class="metrics-grid">
      <mat-card>
        <mat-icon>directions_bus</mat-icon>
        <div class="value">{{ metrics.activeTrips }}</div>
        <div class="label">Viajes activos</div>
      </mat-card>
      <mat-card>
        <mat-icon>school</mat-icon>
        <div class="value">{{ metrics.studentsOnBoard }}</div>
        <div class="label">Estudiantes a bordo</div>
      </mat-card>
      <mat-card>
        <mat-icon>warning</mat-icon>
        <div class="value">{{ metrics.alerts }}</div>
        <div class="label">Alertas</div>
      </mat-card>
      <mat-card>
        <mat-icon>fact_check</mat-icon>
        <div class="value">{{ metrics.attendanceRate }}%</div>
        <div class="label">Asistencia</div>
      </mat-card>
      <mat-card>
        <mat-icon>local_shipping</mat-icon>
        <div class="value">{{ metrics.fleetAvailability }}%</div>
        <div class="label">Flota disponible</div>
      </mat-card>
      <mat-card>
        <mat-icon>alt_route</mat-icon>
        <div class="value">{{ metrics.routeCoverage }}%</div>
        <div class="label">Cobertura de ruta</div>
      </mat-card>
    </div>
  `,
    styles: [`
    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
    .metrics-grid mat-card { text-align: center; padding: 1rem; }
    .metrics-grid mat-icon { font-size: 2rem; width: auto; height: auto; color: #3f51b5; }
    .value { font-size: 1.8rem; font-weight: bold; margin: 0.5rem 0; }
    .label { font-size: 0.8rem; color: gray; }
  `]
})
export class CompanyMetricsComponent {
    @Input() metrics!: CompanyMetrics;
}