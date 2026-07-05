import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'kw-fleet-kpi-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './fleet-kpi-card.component.html',
  styleUrl: './fleet-kpi-card.component.css'
})
export class FleetKpiCardComponent {
  @Input({ required: true }) icon = 'directions_bus';
  @Input({ required: true }) label = '';
  @Input({ required: true }) value: string | number = '';
  @Input() helper = '';
  @Input() tone: 'blue' | 'green' | 'amber' | 'red' = 'blue';
}
