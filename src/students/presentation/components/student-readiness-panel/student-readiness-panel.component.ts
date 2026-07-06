import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { StudentReviewModel } from '../../../domain/models/student-review.model';

@Component({
  selector: 'kw-student-readiness-panel',
  standalone: true,
  imports: [NgClass, MatIconModule, TranslateModule],
  templateUrl: './student-readiness-panel.component.html',
  styleUrl: './student-readiness-panel.component.css'
})
export class StudentReadinessPanelComponent {
  @Input({ required: true }) attendanceReliability = 0;
  @Input({ required: true }) guardianVerified = 0;
  @Input({ required: true }) reviews: StudentReviewModel[] = [];
}
