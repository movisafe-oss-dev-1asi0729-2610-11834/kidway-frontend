import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AssignmentEntity } from '../../../domain/entities/assignment.entity';
import { AssignmentShift, AssignmentStatus, AssignmentValidation } from '../../../domain/models/assignment-status.type';

export type AssignmentFormResult = Omit<AssignmentEntity, 'id' | 'lastUpdated'> & {
  id?: string;
  lastUpdated?: string;
};

@Component({
  selector: 'kw-assignment-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './assignment-form-dialog.component.html',
  styleUrl: './assignment-form-dialog.component.css'
})
export class AssignmentFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<AssignmentFormDialogComponent, AssignmentFormResult>>(MatDialogRef);
  protected readonly data = inject<AssignmentEntity | null>(MAT_DIALOG_DATA, { optional: true });

  protected readonly shiftOptions: AssignmentShift[] = ['morning', 'afternoon'];
  protected readonly statusOptions: AssignmentStatus[] = ['validated', 'pending', 'conflict', 'inactive'];
  protected readonly validationOptions: AssignmentValidation[] = [
    'ready',
    'capacity-risk',
    'schedule-conflict',
    'missing-route',
    'inactive'
  ];

  protected readonly form = this.fb.nonNullable.group({
    studentCode: [this.data?.studentCode ?? '', Validators.required],
    studentName: [this.data?.studentName ?? '', Validators.required],
    grade: [this.data?.grade ?? '', Validators.required],
    guardianName: [this.data?.guardianName ?? '', Validators.required],
    routeCode: [this.data?.routeCode ?? '', Validators.required],
    routeName: [this.data?.routeName ?? '', Validators.required],
    vehiclePlate: [this.data?.vehiclePlate ?? '', Validators.required],
    driverName: [this.data?.driverName ?? '', Validators.required],
    shift: [this.data?.shift ?? 'morning' as AssignmentShift, Validators.required],
    pickupPoint: [this.data?.pickupPoint ?? '', Validators.required],
    pickupWindow: [this.data?.pickupWindow ?? '', Validators.required],
    capacityUsage: [this.data?.capacityUsage ?? 75, [Validators.required, Validators.min(0), Validators.max(100)]],
    validationScore: [this.data?.validationScore ?? 90, [Validators.required, Validators.min(0), Validators.max(100)]],
    validation: [this.data?.validation ?? 'ready' as AssignmentValidation, Validators.required],
    status: [this.data?.status ?? 'validated' as AssignmentStatus, Validators.required],
    notes: [this.data?.notes ?? '', Validators.required]
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.dialogRef.close({
      id: this.data?.id,
      lastUpdated: this.data?.lastUpdated,
      ...value
    });
  }

  cancel(): void {
    this.dialogRef.close(undefined);
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
