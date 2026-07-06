import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { StudentEntity } from '../../../domain/entities/student.entity';
import { StudentStatus } from '../../../domain/models/student-status.type';

export interface StudentFormResult {
  firstName: string;
  lastName: string;
  grade: string;
  school: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  emergencyContact: string;
  routeName: string | null;
  pickupPoint: string | null;
  pickupWindow: string | null;
  status: StudentStatus;
}

@Component({
  selector: 'kw-student-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    TranslateModule
  ],
  template: `
    <section class="student-form-dialog">
      <header>
        <div>
          <p>{{ 'studentsPage.dialogs.formEyebrow' | translate }}</p>
          <h2>{{ (data ? 'studentsPage.dialogs.editTitle' : 'studentsPage.dialogs.registerTitle') | translate }}</h2>
        </div>
        <button mat-icon-button type="button" mat-dialog-close aria-label="Close student form">
          <mat-icon>close</mat-icon>
        </button>
      </header>

      <mat-dialog-content>
        <form [formGroup]="studentForm" class="student-form">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'studentsPage.dialogs.firstName' | translate }}</mat-label>
            <input matInput formControlName="firstName" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>{{ 'studentsPage.dialogs.lastName' | translate }}</mat-label>
            <input matInput formControlName="lastName" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>{{ 'studentsPage.dialogs.grade' | translate }}</mat-label>
            <input matInput formControlName="grade" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>{{ 'studentsPage.dialogs.school' | translate }}</mat-label>
            <input matInput formControlName="school" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>{{ 'studentsPage.dialogs.guardianName' | translate }}</mat-label>
            <input matInput formControlName="guardianName" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>{{ 'studentsPage.dialogs.guardianPhone' | translate }}</mat-label>
            <input matInput formControlName="guardianPhone" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>{{ 'studentsPage.dialogs.guardianEmail' | translate }}</mat-label>
            <input matInput formControlName="guardianEmail" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>{{ 'studentsPage.dialogs.emergencyContact' | translate }}</mat-label>
            <input matInput formControlName="emergencyContact" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>{{ 'studentsPage.dialogs.route' | translate }}</mat-label>
            <input matInput formControlName="routeName" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>{{ 'studentsPage.dialogs.pickupPoint' | translate }}</mat-label>
            <input matInput formControlName="pickupPoint" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>{{ 'studentsPage.dialogs.pickupWindow' | translate }}</mat-label>
            <input matInput formControlName="pickupWindow" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>{{ 'studentsPage.dialogs.status' | translate }}</mat-label>
            <mat-select formControlName="status">
              <mat-option value="active">{{ 'studentsPage.status.active' | translate }}</mat-option>
              <mat-option value="unassigned">{{ 'studentsPage.status.unassigned' | translate }}</mat-option>
              <mat-option value="review">{{ 'studentsPage.status.review' | translate }}</mat-option>
              <mat-option value="inactive">{{ 'studentsPage.status.inactive' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>{{ 'studentsPage.dialogs.cancel' | translate }}</button>
        <button mat-flat-button color="primary" type="button" [disabled]="studentForm.invalid" (click)="save()">
          {{ (data ? 'studentsPage.dialogs.save' : 'studentsPage.dialogs.register') | translate }}
        </button>
      </mat-dialog-actions>
    </section>
  `,
  styles: [`
    .student-form-dialog { width: min(940px, 94vw); max-width: 100%; color: var(--kw-ink); overflow: hidden; }
    header { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; padding: 4px 2px 12px; }
    header p { margin: 0 0 4px; color: #1682c6; font-size: .74rem; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
    header h2 { margin: 0; color: var(--kw-ink); font-size: 1.8rem; letter-spacing: -.05em; }
    .student-form { display: grid; grid-template-columns: repeat(2, minmax(240px, 1fr)); gap: 12px; padding-top: 10px; min-width: 0; }
    mat-icon { width: 18px; height: 18px; font-size: 18px; }
    @media (max-width: 640px) { .student-form { grid-template-columns: 1fr; } }
  `]
})
export class StudentFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<StudentFormDialogComponent, StudentFormResult>>(MatDialogRef);
  protected readonly data = inject<StudentEntity | null>(MAT_DIALOG_DATA, { optional: true });

  protected readonly studentForm = this.fb.nonNullable.group({
    firstName: [this.data?.firstName ?? '', Validators.required],
    lastName: [this.data?.lastName ?? '', Validators.required],
    grade: [this.data?.grade ?? '', Validators.required],
    school: [this.data?.school ?? '', Validators.required],
    guardianName: [this.data?.guardianName ?? '', Validators.required],
    guardianPhone: [this.data?.guardianPhone ?? '', Validators.required],
    guardianEmail: [this.data?.guardianEmail ?? '', [Validators.required, Validators.email]],
    emergencyContact: [this.data?.emergencyContact ?? '', Validators.required],
    routeName: [this.data?.routeName ?? ''],
    pickupPoint: [this.data?.pickupPoint ?? ''],
    pickupWindow: [this.data?.pickupWindow ?? ''],
    status: [this.data?.status ?? 'unassigned' as StudentStatus, Validators.required]
  });

  protected save(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    const value = this.studentForm.getRawValue();
    this.dialogRef.close({
      ...value,
      routeName: value.routeName.trim() || null,
      pickupPoint: value.pickupPoint.trim() || null,
      pickupWindow: value.pickupWindow.trim() || null
    });
  }
}
