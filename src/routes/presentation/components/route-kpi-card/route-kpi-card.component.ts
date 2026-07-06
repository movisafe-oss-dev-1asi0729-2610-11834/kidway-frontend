import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'kw-route-kpi-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './route-kpi-card.component.html',
  styleUrl: './route-kpi-card.component.css'
})
export class RouteKpiCardComponent {
  @Input({ required: true }) icon = 'alt_route';
  @Input({ required: true }) label = '';
  @Input({ required: true }) value: string | number = '';
  @Input() helper = '';
  @Input() tone: 'blue' | 'green' | 'amber' | 'red' = 'blue';
}
