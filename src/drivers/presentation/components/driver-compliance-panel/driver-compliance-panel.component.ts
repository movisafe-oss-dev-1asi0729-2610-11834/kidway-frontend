import { DatePipe, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { DriverReviewModel } from '../../../domain/models/driver-review.model';

@Component({
  selector: 'kw-driver-compliance-panel',
  standalone: true,
  imports: [DatePipe, NgClass, MatIconModule, TranslateModule],
  templateUrl: './driver-compliance-panel.component.html',
  styleUrl: './driver-compliance-panel.component.css'
})
export class DriverCompliancePanelComponent {
  @Input({ required: true }) reviews: DriverReviewModel[] = [];
}
