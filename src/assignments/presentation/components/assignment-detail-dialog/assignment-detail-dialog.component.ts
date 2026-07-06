import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AssignmentEntity } from '../../../domain/entities/assignment.entity';

@Component({
  selector: 'kw-assignment-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './assignment-detail-dialog.component.html',
  styleUrl: './assignment-detail-dialog.component.css'
})
export class AssignmentDetailDialogComponent {
  protected readonly assignment = inject<AssignmentEntity>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AssignmentDetailDialogComponent>);

  close(): void {
    this.dialogRef.close();
  }

  statusLabelKey(status: string): string {
    return `assignments.status.${status}`;
  }

  shiftLabelKey(shift: string): string {
    return `assignments.shift.${shift}`;
  }

  validationLabelKey(validation: string): string {
    return `assignments.validation.${validation}`;
  }
}
