import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { Student } from '../../../domain/entities/student.entity';

@Component({
    selector: 'app-student-form-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, TranslateModule],
    template: `
        <h2 mat-dialog-title>{{ (isEdit ? 'students.dialogs.edit_title' : 'students.dialogs.new_title') | translate }}</h2>
        <mat-dialog-content>
            <form [formGroup]="studentForm" class="edit-form">
                <mat-form-field appearance="outline">
                    <mat-label>{{ 'students.dialogs.name' | translate }}</mat-label>
                    <input matInput formControlName="firstName">
                </mat-form-field>
                <mat-form-field appearance="outline">
                    <mat-label>{{ 'students.dialogs.last_name' | translate }}</mat-label>
                    <input matInput formControlName="lastName">
                </mat-form-field>
                <mat-form-field appearance="outline">
                    <mat-label>{{ 'students.dialogs.grade' | translate }}</mat-label>
                    <input matInput formControlName="grade">
                </mat-form-field>
                <mat-form-field appearance="outline">
                    <mat-label>{{ 'students.dialogs.tutor' | translate }}</mat-label>
                    <input matInput formControlName="tutorName">
                </mat-form-field>
                <mat-form-field appearance="outline">
                    <mat-label>{{ 'students.dialogs.contact' | translate }}</mat-label>
                    <input matInput formControlName="tutorContact">
                </mat-form-field>
                <mat-form-field appearance="outline">
                    <mat-label>{{ 'students.dialogs.status' | translate }}</mat-label>
                    <mat-select formControlName="status">
                        <mat-option value="Activo">{{ 'students.management.status.active' | translate }}</mat-option>
                        <mat-option value="Sin ruta">{{ 'students.management.status.unassigned' | translate }}</mat-option>
                        <mat-option value="Inactivo">{{ 'students.management.status.inactive' | translate }}</mat-option>
                    </mat-select>
                </mat-form-field>
                <mat-form-field appearance="outline">
                    <mat-label>{{ 'students.dialogs.route' | translate }}</mat-label>
                    <input matInput formControlName="routeAssigned">
                </mat-form-field>
                <mat-form-field appearance="outline">
                    <mat-label>{{ 'students.dialogs.stop' | translate }}</mat-label>
                    <input matInput formControlName="stopName">
                </mat-form-field>
            </form>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close>{{ 'students.dialogs.cancel' | translate }}</button>
            <button mat-flat-button color="primary" [disabled]="studentForm.invalid" (click)="save()">
                {{ (isEdit ? 'students.dialogs.save' : 'students.dialogs.register') | translate }}
            </button>
        </mat-dialog-actions>
    `,
    styles: [`.edit-form { display: flex; flex-direction: column; gap: 4px; margin-top: 16px; min-width: 380px; }`]
})
export class StudentFormDialogComponent {
    studentForm: FormGroup;
    isEdit: boolean;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<StudentFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Student | null
    ) {
        this.isEdit = !!data;
        this.studentForm = this.fb.group({
            firstName: [data?.firstName || '', Validators.required],
            lastName: [data?.lastName || '', Validators.required],
            grade: [data?.grade || '', Validators.required],
            tutorName: [data?.tutorName || '', Validators.required],
            tutorContact: [data?.tutorContact || '', Validators.required],
            status: [data?.status || 'Sin ruta', Validators.required],
            code: [data?.code || `#AL-00${Math.floor(Math.random() * 1000)}`],
            routeAssigned: [data?.routeAssigned || null],
            stopName: [data?.stopName || null]
        });
    }

    save() {
        if (this.studentForm.valid) {
            const formData = this.studentForm.value;
            const updatedStudent = {
                ...(this.data || {}),
                ...formData
            };
            this.dialogRef.close(updatedStudent);
        }
    }
}