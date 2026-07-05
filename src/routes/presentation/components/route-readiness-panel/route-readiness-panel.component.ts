import { DatePipe, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouteReviewModel } from '../../../domain/models/route-review.model';

@Component({
  selector: 'kw-route-readiness-panel',
  standalone: true,
  imports: [DatePipe, NgClass, MatIconModule],
  templateUrl: './route-readiness-panel.component.html',
  styleUrl: './route-readiness-panel.component.css'
})
export class RouteReadinessPanelComponent {
  @Input() optimizationScore = 0;
  @Input() reviews: RouteReviewModel[] = [];

  readinessGradient(): string {
    const value = Math.max(0, Math.min(this.optimizationScore, 100));
    return `conic-gradient(var(--kw-blue-700) ${value}%, #e9eff7 0)`;
  }
}
