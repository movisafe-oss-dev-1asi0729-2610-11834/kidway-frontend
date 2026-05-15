import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Alert } from '../../../application/services/mock-data.service';

@Component({
    selector: 'app-alerts-widget',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule, MatListModule],
    template: `
    <mat-card class="alerts-card">
      <mat-card-header>
        <mat-icon>notifications_active</mat-icon>
        <mat-card-title>Alertas recientes</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-list>
          <mat-list-item *ngFor="let alert of alerts">
            <mat-icon matListItemIcon [class]="alert.type">warning</mat-icon>
            <div matListItemTitle>{{ alert.message }}</div>
            <div matListItemLine>{{ alert.timestamp | date:'short' }}</div>
            <div *ngIf="!alert.read" class="unread-badge">Nueva</div>
          </mat-list-item>
          <mat-list-item *ngIf="alerts.length === 0">
            <mat-icon matListItemIcon>check_circle</mat-icon>
            <div matListItemTitle>No hay alertas activas</div>
          </mat-list-item>
        </mat-list>
      </mat-card-content>
    </mat-card>
  `,
    styles: [`
    .alerts-card { margin-top: 1rem; }
    .unread-badge { background: #f44336; color: white; border-radius: 12px; padding: 2px 8px; font-size: 0.7rem; margin-left: 8px; }
    mat-icon.delay, mat-icon.deviation { color: #ff9800; }
    mat-icon.incident { color: #f44336; }
    mat-icon.emergency { color: #d32f2f; }
  `]
})
export class AlertsWidgetComponent {
    @Input() alerts: Alert[] = [];
}