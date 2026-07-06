import { Component, Input } from '@angular/core';
import { TripReviewModel } from '../../../domain/models/trip-review.model';

@Component({
  selector: 'kw-trip-readiness-panel',
  standalone: true,
  templateUrl: './trip-readiness-panel.component.html',
  styleUrl: './trip-readiness-panel.component.css'
})
export class TripReadinessPanelComponent {
  @Input() score = 0;
  @Input() reviews: TripReviewModel[] = [];
}
