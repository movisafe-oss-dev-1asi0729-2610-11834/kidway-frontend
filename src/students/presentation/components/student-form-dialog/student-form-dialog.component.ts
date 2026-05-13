import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Student } from '../../../domain/entities/student.entity';

@Component({
    selector: 'app-student-form-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
    template: `
        <h2 mat-dialog-title>{{ isEdit ? 'Editar Alumno' : 'Registrar Nuevo Alumno' }}</h2>
        <mat-dialog-content>
            <form [formGroup]="studentForm" class="edit-form">
                <mat-form-field appearance="outline">
                    <mat-label>Nombre</mat-label>
                    <input matInput formControlName="firstName">
                </mat-form-field>
                <mat-form-field appearance="outline">
                    <mat-label>Apellido</mat-label>
                    <input matInput formControlName="lastName">
                </mat-form-field>
                <mat-form-field appearance="outline">
                    <mat-label>Grado</mat-label>
                    <input matInput formControlName="grade" placeholder="Ej: 3° Primaria">
                </mat-form-field>
                <mat-form-field appearance="outline">
                    <mat-label>Nombre del Tutor</mat-label>
                    <input matInput formControlName="tutorName">
                </mat-form-field>
                <mat-form-field appearance="outline">
                    <mat-label>Contacto del Tutor</mat-label>
                    <input matInput formControlName="tutorContact">
                </mat-form-field>
                <mat-form-field appearance="outline">
                    <mat-label>Estado</mat-label>
                    <mat-select formControlName="status">
                        <mat-option value="Activo">Activo</mat-option>
                        <mat-option value="Sin ruta">Sin ruta</mat-option>
                        <mat-option value="Inactivo">Inactivo</mat-option>
                    </mat-select>
                </mat-form-field>
            </form>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close>Cancelar</button>
            <button mat-flat-button color="primary" [disabled]="studentForm.invalid" (click)="save()">
                {{ isEdit ? 'Guardar Cambios' : 'Registrar' }}
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
            const studentData = {
                id: this.isEdit && this.data ? this.data.id : 0,
                ...this.studentForm.value
            };
            this.dialogRef.close(new Student(studentData as any));
        }
    }
}
