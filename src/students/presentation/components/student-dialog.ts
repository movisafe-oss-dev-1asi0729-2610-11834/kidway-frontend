import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {Student} from "../../domain/entities/student.entity";

@Component({
    selector: 'app-student-detail-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    template: `
    <h2 mat-dialog-title>Detalles del Alumno</h2>
    <mat-dialog-content>
      <div class="detail-grid">
        <p><strong>Nombre:</strong> {{ data.fullName }}</p>
        <p><strong>Código:</strong> {{ data.code }}</p>
        <p><strong>Grado:</strong> {{ data.grade }}</p>
        <p><strong>Tutor:</strong> {{ data.tutorName }}</p>
        <p><strong>Contacto:</strong> {{ data.tutorContact }}</p>
        <p><strong>Ruta:</strong> {{ data.routeAssigned || 'Sin asignar' }}</p>
        <p><strong>Parada:</strong> {{ data.stopName || 'Sin asignar' }}</p>
        <p><strong>Estado:</strong> {{ data.status }}</p>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `,
    styles: [`
    .detail-grid { display: grid; gap: 12px; margin-top: 10px; font-size: 0.95rem; }
    .detail-grid p { margin: 0; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; }
  `]
})
export class StudentDetailDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: Student) {}
}

@Component({
    selector: 'app-student-edit-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
    template: `
    <h2 mat-dialog-title>Editar Alumno</h2>
    <mat-dialog-content>
      <form [formGroup]="editForm" class="edit-form">
        <mat-form-field appearance="outline">
          <mat-label>Nombre del Tutor</mat-label>
          <input matInput formControlName="tutorName">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Contacto del Tutor</mat-label>
          <input matInput formControlName="tutorContact">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Ruta Asignada</mat-label>
          <mat-select formControlName="routeAssigned">
            <mat-option [value]="null">--- Sin asignar ---</mat-option>
            <mat-option value="Ruta Norte">Ruta Norte</mat-option>
            <mat-option value="Ruta Sur">Ruta Sur</mat-option>
            <mat-option value="Ruta Este">Ruta Este</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Parada</mat-label>
          <input matInput formControlName="stopName">
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
      <button mat-flat-button color="primary" [disabled]="editForm.invalid" (click)="save()">Guardar Cambios</button>
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
            const updatedStudent = new Student({
                ...this.data,
                ...this.editForm.value
            });
            this.dialogRef.close(updatedStudent);
        }
    }
}
