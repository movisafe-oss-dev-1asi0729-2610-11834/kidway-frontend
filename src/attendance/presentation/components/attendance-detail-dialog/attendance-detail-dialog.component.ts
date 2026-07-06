import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AttendanceRecordEntity } from '../../../domain/entities/attendance-record.entity';

@Component({
  selector: 'kw-attendance-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, MatIconModule],
  templateUrl: './attendance-detail-dialog.component.html',
  styleUrl: './attendance-detail-dialog.component.css'
})
export class AttendanceDetailDialogComponent {
  protected readonly record = inject<AttendanceRecordEntity>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AttendanceDetailDialogComponent>);

  close(): void {
    this.dialogRef.close();
  }
}
