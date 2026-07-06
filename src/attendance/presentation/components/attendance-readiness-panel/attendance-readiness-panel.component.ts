import { Component, Input } from '@angular/core';

@Component({
  selector: 'kw-attendance-readiness-panel',
  standalone: true,
  templateUrl: './attendance-readiness-panel.component.html',
  styleUrl: './attendance-readiness-panel.component.css'
})
export class AttendanceReadinessPanelComponent {
  @Input({ required: true }) percentage = 0;
}
