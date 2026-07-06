import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TripEntity } from '../../../domain/entities/trip.entity';
import { TripShift } from '../../../domain/models/trip-shift.type';
import { TripStatus } from '../../../domain/models/trip-status.type';

export interface TripFormResult {
  routeName: string;
  vehiclePlate: string;
  driverName: string;
  school: string;
  district: string;
  shift: TripShift;
  status: TripStatus;
  students: number;
  capacity: number;
  startTime: string;
  estimatedEndTime: string;
  nextStop: string;
  totalStops: number;
}

@Component({
  selector: 'kw-trip-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatIconModule],
  templateUrl: './trip-form-dialog.component.html',
  styleUrl: './trip-form-dialog.component.css'
})
export class TripFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<TripFormDialogComponent, TripFormResult>>(MatDialogRef);
  protected readonly data = inject<TripEntity | null>(MAT_DIALOG_DATA, { optional: true });

  protected readonly form = this.fb.nonNullable.group({
    routeName: [this.data?.routeName ?? '', Validators.required],
    vehiclePlate: [this.data?.vehiclePlate ?? '', Validators.required],
    driverName: [this.data?.driverName ?? '', Validators.required],
    school: [this.data?.school ?? '', Validators.required],
    district: [this.data?.district ?? '', Validators.required],
    shift: [this.data?.shift ?? 'morning' as TripShift, Validators.required],
    status: [this.data?.status ?? 'scheduled' as TripStatus, Validators.required],
    students: [this.data?.students ?? 0, [Validators.required, Validators.min(0)]],
    capacity: [this.data?.capacity ?? 18, [Validators.required, Validators.min(1)]],
    startTime: [this.data?.startTime ?? '06:45', Validators.required],
    estimatedEndTime: [this.data?.estimatedEndTime ?? '07:45', Validators.required],
    nextStop: [this.data?.nextStop ?? '', Validators.required],
    totalStops: [this.data?.totalStops ?? 10, [Validators.required, Validators.min(1)]]
  });

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.getRawValue());
  }
}
