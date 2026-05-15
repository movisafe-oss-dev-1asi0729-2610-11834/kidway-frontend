import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { IncidentFormComponent } from '../components/incident-form/incident-form.component';
import { IncidentListComponent } from '../components/incident-list/incident-list.component';

type Role = 'operator' | 'company';

@Component({
    selector: 'app-incident-view',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonToggleModule,
        MatIconModule,
        IncidentFormComponent,
        IncidentListComponent
    ],
    template: `
    <div class="incident-container">
      <!-- Selector de rol (simulado) -->
      <div class="role-selector">
        <mat-button-toggle-group [value]="selectedRole()" (change)="changeRole($event.value)">
          <mat-button-toggle value="operator">
            <mat-icon>person</mat-icon> Conductor
          </mat-button-toggle>
          <mat-button-toggle value="company">
            <mat-icon>business</mat-icon> Empresa
          </mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      <!-- Formulario de reporte solo visible para Operator -->
      <div *ngIf="selectedRole() === 'operator'">
        <app-incident-form />
      </div>

      <!-- Lista de incidentes (con diferentes permisos) -->
      <app-incident-list [role]="selectedRole()" />

      <div class="info-note" *ngIf="selectedRole() === 'operator'">
        <mat-icon>info</mat-icon> Los incidentes que reportes serán visibles para la administración.
      </div>
    </div>
  `,
    styles: [`
    .incident-container { padding: 1rem; }
    .role-selector { display: flex; justify-content: flex-end; margin-bottom: 1.5rem; }
    .info-note { margin-top: 1rem; padding: 0.8rem; background: #e8f0fe; border-radius: 8px; display: flex; align-items: center; gap: 0.5rem; }
  `]
})
export class IncidentViewComponent {
    selectedRole = signal<Role>('company');

    changeRole(role: Role) {
        this.selectedRole.set(role);
    }
}