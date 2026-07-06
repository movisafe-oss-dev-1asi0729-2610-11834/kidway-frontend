import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'kw-student-kpi-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './student-kpi-card.component.html',
  styleUrl: './student-kpi-card.component.css'
})
export class StudentKpiCardComponent {
  @Input({ required: true }) icon = 'school';
  @Input({ required: true }) label = '';
  @Input({ required: true }) value: string | number = '';
  @Input() helper = '';
  @Input() tone: 'blue' | 'green' | 'amber' | 'red' = 'blue';
}
