import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'kw-attendance-kpi-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './attendance-kpi-card.component.html',
  styleUrl: './attendance-kpi-card.component.css'
})
export class AttendanceKpiCardComponent {
  @Input({ required: true }) icon = 'fact_check';
  @Input({ required: true }) label = '';
  @Input({ required: true }) value: string | number = '';
  @Input() hint = '';
  @Input() tone: 'blue' | 'green' | 'amber' | 'red' = 'blue';
}
