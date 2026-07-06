import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'kw-driver-kpi-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './driver-kpi-card.component.html',
  styleUrl: './driver-kpi-card.component.css'
})
export class DriverKpiCardComponent {
  @Input({ required: true }) icon = 'badge';
  @Input({ required: true }) label = '';
  @Input({ required: true }) value: string | number = '';
  @Input() helper = '';
  @Input() tone: 'blue' | 'green' | 'amber' | 'red' = 'blue';
}
