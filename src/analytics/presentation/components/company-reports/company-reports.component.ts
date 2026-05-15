import { Component, inject, AfterViewInit, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Chart } from 'chart.js';
import { MockAnalyticsService } from '../../../application/services/mock-analytics.service';
import { TripRecord } from '../../../domain/models/analytics.model';

@Component({
    selector: 'app-company-reports',
    standalone: true,
    imports: [
        CommonModule, FormsModule, MatCardModule, MatFormFieldModule,
        MatSelectModule, MatButtonModule, MatTableModule, MatIconModule
    ],
    template: `
    <div class="reports-container">
      <mat-card>
        <mat-card-header>
          <mat-icon>bar_chart</mat-icon>
          <mat-card-title>Reportes de flota</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <!-- Filtros -->
          <div class="filters">
            <mat-form-field appearance="outline">
              <mat-label>Fecha desde</mat-label>
              <input type="date" matInput [(ngModel)]="dateFrom" (change)="applyFilters()">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Fecha hasta</mat-label>
              <input type="date" matInput [(ngModel)]="dateTo" (change)="applyFilters()">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Conductor</mat-label>
              <mat-select [(ngModel)]="selectedDriver" (selectionChange)="applyFilters()">
                <mat-option value="">Todos</mat-option>
                <mat-option *ngFor="let d of drivers" [value]="d">{{ d }}</mat-option>
              </mat-select>
            </mat-form-field>
            <button mat-raised-button color="primary" (click)="exportCSV()">Exportar CSV</button>
          </div>

          <!-- Gráfico de puntualidad -->
          <div class="chart-container">
            <canvas #punctualityChart></canvas>
          </div>

          <!-- Tabla de viajes -->
          <div class="table-container">
            <h3>Viajes recientes</h3>
            <table mat-table [dataSource]="filteredTrips()" class="mat-elevation-z0">
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Fecha</th>
                <td mat-cell *matCellDef="let t">{{ t.date | date:'shortDate' }}</td>
              </ng-container>
              <ng-container matColumnDef="driverName">
                <th mat-header-cell *matHeaderCellDef>Conductor</th>
                <td mat-cell *matCellDef="let t">{{ t.driverName }}</td>
              </ng-container>
              <ng-container matColumnDef="routeName">
                <th mat-header-cell *matHeaderCellDef>Ruta</th>
                <td mat-cell *matCellDef="let t">{{ t.routeName }}</td>
              </ng-container>
              <ng-container matColumnDef="onTimeRate">
                <th mat-header-cell *matHeaderCellDef>Puntualidad</th>
                <td mat-cell *matCellDef="let t">{{ (t.onTimeArrivals / t.plannedStopCount) * 100 | number:'1.0-0' }}%</td>
              </ng-container>
              <ng-container matColumnDef="delays">
                <th mat-header-cell *matHeaderCellDef>Retrasos (min)</th>
                <td mat-cell *matCellDef="let t">{{ t.totalDelaysMinutes }}</td>
              </ng-container>
              <ng-container matColumnDef="incidents">
                <th mat-header-cell *matHeaderCellDef>Incidentes</th>
                <td mat-cell *matCellDef="let t">{{ t.incidentsCount }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <!-- Resumen de métricas -->
          <div class="summary">
            <mat-card>
              <mat-card-header>
                <mat-icon>trending_up</mat-icon>
                <mat-card-title>Resumen</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p><strong>Viajes totales:</strong> {{ metrics.totalTrips }}</p>
                <p><strong>Estudiantes transportados:</strong> {{ metrics.totalStudents }}</p>
                <p><strong>Puntualidad promedio:</strong> {{ metrics.avgOnTimeRate | number:'1.0-0' }}%</p>
                <p><strong>Incidentes totales:</strong> {{ metrics.totalIncidents }}</p>
                <p><strong>Eficiencia combustible:</strong> {{ metrics.fuelEfficiency }} L/100km</p>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
    styles: [`
    .reports-container { padding: 1rem; }
    .filters { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem; align-items: center; }
    .chart-container { margin: 2rem 0; height: 300px; }
    .table-container { overflow-x: auto; margin: 1rem 0; }
    table { width: 100%; }
    .summary { margin-top: 2rem; display: grid; grid-template-columns: 1fr; gap: 1rem; }
  `]
})
export class CompanyReportsComponent implements AfterViewInit {
    @ViewChild('punctualityChart') chartRef!: ElementRef;
    private analyticsService = inject(MockAnalyticsService);

    drivers = this.analyticsService.getDrivers();
    dateFrom: string = '';
    dateTo: string = '';
    selectedDriver: string = '';

    filteredTrips = signal<TripRecord[]>([]);
    metrics = this.analyticsService.getCompanyMetrics();
    displayedColumns: string[] = ['date', 'driverName', 'routeName', 'onTimeRate', 'delays', 'incidents'];

    private chart: Chart | null = null;

    constructor() {
        this.applyFilters();
    }

    ngAfterViewInit() {
        this.updateChart();
    }

    applyFilters() {
        let fromDate: Date | undefined = this.dateFrom ? new Date(this.dateFrom) : undefined;
        let toDate: Date | undefined = this.dateTo ? new Date(this.dateTo) : undefined;
        let driver = this.selectedDriver || undefined;
        const trips = this.analyticsService.getTrips(fromDate, toDate, driver);
        this.filteredTrips.set(trips);
        this.updateChart();
    }

    updateChart() {
        if (!this.chartRef?.nativeElement) return;
        const ctx = this.chartRef.nativeElement.getContext('2d');
        if (!ctx) return;

        const trips = this.filteredTrips();
        // Agrupar por conductor
        const driversMap = new Map<string, number[]>();
        trips.forEach(t => {
            const rate = (t.onTimeArrivals / t.plannedStopCount) * 100;
            if (!driversMap.has(t.driverName)) driversMap.set(t.driverName, []);
            driversMap.get(t.driverName)!.push(rate);
        });
        const driversList = Array.from(driversMap.keys());
        const avgRates = driversList.map(d => {
            const rates = driversMap.get(d)!;
            return rates.reduce((a, b) => a + b, 0) / rates.length;
        });

        if (this.chart) this.chart.destroy();
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: driversList,
                datasets: [{
                    label: 'Puntualidad promedio (%)',
                    data: avgRates,
                    backgroundColor: '#3f51b5',
                    borderRadius: 8
                }]
            },
            options: { responsive: true, maintainAspectRatio: true, scales: { y: { max: 100 } } }
        });
    }

    exportCSV() {
        const trips = this.filteredTrips();
        const csvRows = [['Fecha', 'Conductor', 'Ruta', 'Puntualidad (%)', 'Retrasos (min)', 'Incidentes']];
        trips.forEach(t => {
            const punctuality = (t.onTimeArrivals / t.plannedStopCount) * 100;
            csvRows.push([
                t.date.toLocaleDateString(),
                t.driverName,
                t.routeName,
                punctuality.toFixed(1),
                t.totalDelaysMinutes.toString(),
                t.incidentsCount.toString()
            ]);
        });
        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_viajes.csv';
        a.click();
        URL.revokeObjectURL(url);
    }
}