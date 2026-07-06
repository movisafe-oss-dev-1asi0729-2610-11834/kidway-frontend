import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AttendanceRecordEntity } from '../../../domain/entities/attendance-record.entity';
import { AttendanceStatus } from '../../../domain/models/attendance-status.type';

@Component({
  selector: 'kw-attendance-status-card',
  standalone: true,
  imports: [NgClass, MatIconModule],
  templateUrl: './attendance-status-card.component.html',
  styleUrl: './attendance-status-card.component.css'
})
export class AttendanceStatusCardComponent {
  @Input({ required: true }) record!: AttendanceRecordEntity;
  @Output() view = new EventEmitter<AttendanceRecordEntity>();
  @Output() statusChange = new EventEmitter<{ record: AttendanceRecordEntity; status: AttendanceStatus }>();

  statusLabel(status: AttendanceStatus): string {
    const labels: Record<AttendanceStatus, string> = {
      waiting: 'Waiting',
      on_board: 'On board',
      arrived: 'Arrived',
      absent: 'Absent',
      pending_confirmation: 'Pending confirmation'
    };
    return labels[status];
  }
}
