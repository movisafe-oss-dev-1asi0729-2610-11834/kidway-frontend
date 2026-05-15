import { Component, Input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Incident, IncidentStatus, IncidentStatusLabels, IncidentTypeLabels } from '../../../domain/models/incident.model';
import { MockIncidentService } from '../../../application/services/mock-incident.service';

@Component({
    selector: 'app-incident-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatTableModule,
        MatChipsModule,
        MatIconModule,
        MatButtonModule,
        MatSelectModule
    ],
    template: `
    <mat-card>
      <mat-card-header>
        <mat-icon>list_alt</mat-icon>
        <mat-card-title>Incidentes</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <!-- Filtros rápidos (solo Company puede filtrar por estado) -->
        <div class="filters" *ngIf="role === 'company'">
          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Filtrar por estado</mat-label>
            <mat-select [(ngModel)]="statusFilter" (selectionChange)="applyFilters()">
              <mat-option value="all">Todos</mat-option>
              <mat-option *ngFor="let status of statuses" [value]="status">
                {{ getStatusLabel(status) }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="table-container">
          <table mat-table [dataSource]="filteredIncidents()" class="mat-elevation-z0">
            <!-- Columnas comunes -->
            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Tipo</th>
              <td mat-cell *matCellDef="let inc">{{ getTypeLabel(inc.type) }}</td>
            </ng-container>
            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Descripción</th>
              <td mat-cell *matCellDef="let inc">{{ inc.description | slice:0:60 }}{{ inc.description.length > 60 ? '...' : '' }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let inc">
                <mat-chip [color]="getChipColor(inc.status)" selected>
                  {{ getStatusLabel(inc.status) }}
                </mat-chip>
              </td>
            </ng-container>
            <ng-container matColumnDef="timestamp">
              <th mat-header-cell *matHeaderCellDef>Fecha/Hora</th>
              <td mat-cell *matCellDef="let inc">{{ inc.timestamp | date:'short' }}</td>
            </ng-container>
            <ng-container matColumnDef="reportedBy">
              <th mat-header-cell *matHeaderCellDef>Reportado por</th>
              <td mat-cell *matCellDef="let inc">{{ inc.reportedBy }}</td>
            </ng-container>
            <!-- Columna de acciones -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let inc">
                <button mat-icon-button color="primary" (click)="editIncident(inc)" *ngIf="canEdit(inc)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteIncident(inc.id)" *ngIf="role === 'operator'">
                  <mat-icon>delete</mat-icon>
                </button>
                <mat-form-field appearance="fill" *ngIf="role === 'company'" class="status-select">
                  <mat-select [value]="inc.status" (selectionChange)="changeStatus(inc.id, $event.value)">
                    <mat-option *ngFor="let s of statuses" [value]="s">{{ getStatusLabel(s) }}</mat-option>
                  </mat-select>
                </mat-form-field>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>

        <div *ngIf="filteredIncidents().length === 0" class="empty-message">
          No hay incidentes que coincidan con los filtros.
        </div>
      </mat-card-content>
    </mat-card>
  `,
    styles: [`
    .filters { display: flex; gap: 1rem; margin-bottom: 1rem; align-items: center; }
    .filter-field { width: 200px; }
    .table-container { overflow-x: auto; }
    table { width: 100%; }
    .status-select { width: 120px; margin-left: 8px; }
    .empty-message { padding: 2rem; text-align: center; color: gray; }
    mat-chip { font-size: 0.75rem; }
  `]
})
export class IncidentListComponent {
    @Input() role: 'operator' | 'company' = 'company';
    private incidentService = inject(MockIncidentService);

    statuses: IncidentStatus[] = ['open', 'in_progress', 'resolved', 'closed'];
    statusFilter: string = 'all';
    displayedColumns: string[] = ['type', 'description', 'status', 'timestamp', 'reportedBy', 'actions'];

    incidents = this.incidentService.incidents;
    filteredIncidents = signal<Incident[]>([]);

    constructor() {
        this.applyFilters();
    }

    getTypeLabel(type: string): string {
        return IncidentTypeLabels[type as keyof typeof IncidentTypeLabels] || type;
    }

    getStatusLabel(status: string): string {
        return IncidentStatusLabels[status as keyof typeof IncidentStatusLabels] || status;
    }

    applyFilters() {
        let list = [...this.incidentService.getIncidents(this.role, 'Carlos Pérez')];
        if (this.role === 'company' && this.statusFilter !== 'all') {
            list = list.filter(inc => inc.status === this.statusFilter);
        }
        this.filteredIncidents.set(list);
    }

    changeStatus(id: string, status: IncidentStatus) {
        this.incidentService.changeStatus(id, status);
        this.applyFilters();
    }

    canEdit(incident: Incident): boolean {
        if (this.role === 'operator') {
            return incident.status === 'open';
        }
        return false;
    }

    editIncident(incident: Incident) {
        const newDesc = prompt('Editar descripción:', incident.description);
        if (newDesc !== null) {
            this.incidentService.updateIncident(incident.id, { description: newDesc });
            this.applyFilters();
        }
    }

    deleteIncident(id: string) {
        if (confirm('¿Eliminar este incidente?')) {
            this.incidentService.deleteIncident(id);
            this.applyFilters();
        }
    }

    getChipColor(status: IncidentStatus): string {
        switch(status) {
            case 'open': return 'warn';
            case 'in_progress': return 'accent';
            case 'resolved': return 'primary';
            default: return '';
        }
    }
}