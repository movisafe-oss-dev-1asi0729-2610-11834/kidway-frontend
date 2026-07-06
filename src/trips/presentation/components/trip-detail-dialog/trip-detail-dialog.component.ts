import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TripEntity } from '../../../domain/entities/trip.entity';

@Component({
  selector: 'kw-trip-detail-dialog',
  standalone: true,
  imports: [NgClass, MatDialogModule, MatIconModule],
  templateUrl: './trip-detail-dialog.component.html',
  styleUrl: './trip-detail-dialog.component.css'
})
export class TripDetailDialogComponent {
  protected readonly trip = inject<TripEntity>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<TripDetailDialogComponent>);

  close(): void {
    this.dialogRef.close();
  }
}
