import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { Student } from "../../domain/entities/student.entity";

@Component({
    selector: 'app-student-detail-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, TranslateModule],
    template: `
        <h2 mat-dialog-title>{{ 'students.dialogs.detail_title' | translate }}</h2>
        <mat-dialog-content>
            <div class="detail-grid">
                <p><strong>{{ 'students.dialogs.name' | translate }}:</strong> {{ data.fullName }}</p>
                <p><strong>{{ 'students.dialogs.code' | translate }}:</strong> {{ data.code }}</p>
                <p><strong>{{ 'students.dialogs.grade' | translate }}:</strong> {{ data.grade }}</p>
                <p><strong>{{ 'students.dialogs.tutor' | translate }}:</strong> {{ data.tutorName }}</p>
                <p><strong>{{ 'students.dialogs.contact' | translate }}:</strong> {{ data.tutorContact }}</p>
                <p><strong>{{ 'students.dialogs.route' | translate }}:</strong> {{ data.routeAssigned || ('students.dialogs.unassigned' | translate) }}</p>
                <p><strong>{{ 'students.dialogs.stop' | translate }}:</strong> {{ data.stopName || ('students.dialogs.unassigned' | translate) }}</p>
                <p><strong>{{ 'students.dialogs.status' | translate }}:</strong>
                    {{ data.status === 'Activo' ? ('students.management.status.active' | translate) :
                            data.status === 'Sin ruta' ? ('students.management.status.unassigned' | translate) :
                                    ('students.management.status.inactive' | translate) }}
                </p>
            </div>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close>{{ 'students.dialogs.close' | translate }}</button>
        </mat-dialog-actions>
    `,
    styles: [`
        .detail-grid { display: grid; gap: 8px; font-size: 0.95rem; min-width: 300px; padding-top: 10px; }
        .detail-grid p { margin: 0; padding: 6px 0; border-bottom: 1px solid #f1f5f9; }
        .detail-grid strong { color: #64748b; margin-right: 8px; }
    `]
})
export class StudentDetailDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<StudentDetailDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Student
    ) {}
}

@Component({
    selector: 'app-student-edit-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, TranslateModule],
    template: `
        <h2 mat-dialog-title>{{ 'students.dialogs.edit_title' | translate }}</h2>
        <mat-dialog-content>
            <form [formGroup]="editForm" class="edit-form">
                <mat-form-field appearance="outline">
                    <mat-label>{{ 'students.dialogs.tutor' | translate }}</mat-label>
                    <input matInput formControlName="tutorName">
                </mat-form-field>
                <mat-form-field appearance="outline">
                    <mat-label>{{ 'students.dialogs.contact' | translate }}</mat-label>
                    <input matInput formControlName="tutorContact">
                </mat-form-field>
                <mat-form-field appearance="outline">
                    <mat-label>{{ 'students.dialogs.route' | translate }}</mat-label>
                    <input matInput formControlName="routeAssigned">
                </mat-form-field>
                <mat-form-field appearance="outline">
                    <mat-label>{{ 'students.dialogs.stop' | translate }}</mat-label>
                    <input matInput formControlName="stopName">
                </mat-form-field>
                <mat-form-field appearance="outline">
                    <mat-label>{{ 'students.dialogs.status' | translate }}</mat-label>
                    <mat-select formControlName="status">
                        <mat-option value="Activo">{{ 'students.management.status.active' | translate }}</mat-option>
                        <mat-option value="Sin ruta">{{ 'students.management.status.unassigned' | translate }}</mat-option>
                        <mat-option value="Inactivo">{{ 'students.management.status.inactive' | translate }}</mat-option>
                    </mat-select>
                </mat-form-field>
            </form>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close>{{ 'students.dialogs.cancel' | translate }}</button>
            <button mat-flat-button color="primary" [disabled]="editForm.invalid" (click)="save()">{{ 'students.dialogs.save' | translate }}</button>
        </mat-dialog-actions>
    `,
    styles: [`
        .edit-form { display: flex; flex-direction: column; gap: 4px; margin-top: 16px; min-width: 350px; }
    `]
})
export class StudentEditDialogComponent {
    editForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<StudentEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Student
    ) {
        this.editForm = this.fb.group({
            tutorName: [data.tutorName, Validators.required],
            tutorContact: [data.tutorContact, Validators.required],
            routeAssigned: [data.routeAssigned],
            stopName: [data.stopName],
            status: [data.status, Validators.required]
        });
    }

    save() {
        if (this.editForm.valid) {
            this.dialogRef.close(this.editForm.value);
        }
    }
}