import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MockIncidentService } from '../../../application/services/mock-incident.service';
import { IncidentType, IncidentTypeLabels } from '../../../domain/models/incident.model';

@Component({
    selector: 'app-incident-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule
    ],
    template: `
    <mat-card class="incident-form-card">
      <mat-card-header>
        <mat-icon>report_problem</mat-icon>
        <mat-card-title>Reportar incidente</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form #incidentForm="ngForm">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Tipo de incidente</mat-label>
            <mat-select [(ngModel)]="newIncident.type" name="type" required>
              <mat-option *ngFor="let type of incidentTypes" [value]="type">
                {{ typeLabels[type] }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descripción (opcional)</mat-label>
            <textarea matInput rows="3" [(ngModel)]="newIncident.description" name="description"></textarea>
          </mat-form-field>

          <div class="location-info">
            <mat-icon>location_on</mat-icon>
            <span>Ubicación: {{ currentLocation.address }}</span>
          </div>

          <div class="form-actions">
            <button mat-raised-button color="primary" (click)="submitIncident()" [disabled]="!newIncident.type">
              <mat-icon>send</mat-icon> Reportar incidente
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
    styles: [`
    .incident-form-card { margin-bottom: 1.5rem; }
    .full-width { width: 100%; margin-bottom: 1rem; }
    .location-info { display: flex; align-items: center; gap: 8px; margin: 1rem 0; padding: 8px; background: #f5f5f5; border-radius: 8px; }
    .form-actions { display: flex; justify-content: flex-end; margin-top: 1rem; }
  `]
})
export class IncidentFormComponent {
    private incidentService = inject(MockIncidentService);

    incidentTypes: IncidentType[] = ['delay', 'accident', 'detour', 'medical_emergency', 'other'];
    typeLabels = IncidentTypeLabels;

    newIncident = {
        type: null as IncidentType | null,
        description: ''
    };

    currentLocation = this.incidentService.getCurrentLocation();

    submitIncident() {
        if (!this.newIncident.type) return;
        this.incidentService.addIncident({
            type: this.newIncident.type,
            description: this.newIncident.description || 'Sin detalles',
            status: 'open',
            timestamp: new Date(),
            location: this.currentLocation,
            reportedBy: 'Carlos Pérez', // Simulado, debería venir del auth
            vehicleId: 'v1' // Simulado
        });
        // Resetear formulario
        this.newIncident = { type: null, description: '' };
    }
}