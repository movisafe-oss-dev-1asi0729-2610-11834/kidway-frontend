import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'kw-trip-kpi-card',
  standalone: true,
  imports: [NgClass, MatIconModule],
  templateUrl: './trip-kpi-card.component.html',
  styleUrl: './trip-kpi-card.component.css'
})
export class TripKpiCardComponent {
  @Input({ required: true }) icon = 'route';
  @Input({ required: true }) label = '';
  @Input({ required: true }) value: string | number = '';
  @Input() helper = '';
  @Input() tone: 'blue' | 'green' | 'amber' | 'red' = 'blue';
}
