import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MaintenanceAlertModel } from '../../../domain/models/maintenance-alert.model';

@Component({
  selector: 'kw-fleet-maintenance-panel',
  standalone: true,
  imports: [NgClass, MatIconModule, TranslateModule],
  templateUrl: './fleet-maintenance-panel.component.html',
  styleUrl: './fleet-maintenance-panel.component.css'
})
export class FleetMaintenancePanelComponent {
  @Input({ required: true }) alerts: MaintenanceAlertModel[] = [];
}
