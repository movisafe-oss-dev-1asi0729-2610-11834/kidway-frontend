import { Component, EventEmitter, Input, Output, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { Assignment } from '../../../domain/entities/assignment.entity';

@Component({
    selector: 'app-assignment-create-and-edit',
    standalone: true,
    imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, TranslateModule],
    template: `
        <div class="form-wrapper">
            <h2>{{ (assignment?.id ? 'assignments.management.form.edit_title' : 'assignments.management.form.add_title') | translate }}</h2>

            <form #assignmentForm="ngForm" (submit)="onSubmit()" class="kw-form">

                <mat-form-field appearance="outline">
                    <mat-label>{{ 'assignments.management.table.student' | translate }}</mat-label>
                    <input matInput name="studentName" [(ngModel)]="formData.studentName" required>
                </mat-form-field>

                <mat-form-field appearance="outline">
                    <mat-label>ID / {{ 'assignments.management.form.code' | translate }}</mat-label>
                    <input matInput name="studentId" [(ngModel)]="formData.studentId" required>
                </mat-form-field>

                <mat-form-field appearance="outline">
                    <mat-label>{{ 'assignments.management.form.tutor' | translate }}</mat-label>
                    <input matInput name="tutorName" [(ngModel)]="formData.tutorName" required>
                </mat-form-field>

                <mat-form-field appearance="outline">
                    <mat-label>{{ 'assignments.management.table.route' | translate }}</mat-label>
                    <input matInput name="routeName" [(ngModel)]="formData.routeName" required>
                </mat-form-field>

                <mat-form-field appearance="outline">
                    <mat-label>{{ 'assignments.management.table.vehicle' | translate }}</mat-label>
                    <input matInput name="vehiclePlate" [(ngModel)]="formData.vehiclePlate" required>
                </mat-form-field>

                <mat-form-field appearance="outline">
                    <mat-label>{{ 'assignments.management.table.shift' | translate }}</mat-label>
                    <mat-select name="shift" [(ngModel)]="formData.shift" required>
                        <mat-option value="Morning">{{ 'assignments.management.shift.morning' | translate }}</mat-option>
                        <mat-option value="Afternoon">{{ 'assignments.management.shift.afternoon' | translate }}</mat-option>
                    </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                    <mat-label>{{ 'assignments.management.table.status' | translate }}</mat-label>
                    <mat-select name="status" [(ngModel)]="formData.status" required>
                        <mat-option value="Active">{{ 'assignments.management.status.active' | translate }}</mat-option>
                        <mat-option value="Inactive">{{ 'assignments.management.status.inactive' | translate }}</mat-option>
                    </mat-select>
                </mat-form-field>

                <div class="form-actions">
                    <button type="button" mat-button (click)="onCancel()">{{ 'assignments.management.form.cancel' | translate }}</button>
                    <button type="submit" mat-flat-button color="primary" [disabled]="assignmentForm.invalid">
                        {{ 'assignments.management.form.save' | translate }}
                    </button>
                </div>
            </form>
        </div>
    `,
    styles: [`
        .form-wrapper { padding: 24px; background: #fff; border-radius: 16px; border: 1px solid #e2e8f0; }
        h2 { margin-top: 0; color: #0f172a; }
        .kw-form { display: flex; flex-direction: column; gap: 16px; max-width: 500px; }
        mat-form-field { width: 100%; }
        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; }
    `]
})
export class AssignmentCreateAndEditComponent implements OnChanges {
    @Input() assignment: Assignment | null = null;
    @Output() editCanceled = new EventEmitter();
    @Output() editSaved = new EventEmitter<Assignment>();

    @ViewChild('assignmentForm', { static: false }) assignmentForm!: NgForm;

    formData = {
        id: 0,
        studentName: '',
        studentId: '',
        routeName: '',
        vehiclePlate: '',
        shift: 'Morning',
        status: 'Active',
        tutorName: ''
    };

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['assignment'] && changes['assignment'].currentValue) {
            const current = changes['assignment'].currentValue as Assignment;
            this.formData = {
                id: current.id,
                studentName: current.studentName,
                studentId: current.studentId,
                routeName: current.routeName,
                vehiclePlate: current.vehiclePlate,
                shift: current.shift as any,
                status: current.status as any,
                tutorName: current.tutorName
            };
        } else {
            this.resetForm();
        }
    }

    private resetForm() {
        this.formData = { id: 0, studentName: '', studentId: '', routeName: '', vehiclePlate: '', shift: 'Morning', status: 'Active', tutorName: '' };
        if (this.assignmentForm) {
            this.assignmentForm.resetForm(this.formData);
        }
    }

    onSubmit() {
        if (this.assignmentForm.invalid) return;

        const assignmentToSave = new Assignment({
            id: this.formData.id,
            studentName: this.formData.studentName,
            studentId: this.formData.studentId,
            routeName: this.formData.routeName,
            vehiclePlate: this.formData.vehiclePlate,
            shift: this.formData.shift as 'Morning' | 'Afternoon',
            status: this.formData.status as 'Active' | 'Inactive',
            tutorName: this.formData.tutorName
        });

        this.editSaved.emit(assignmentToSave);
    }

    onCancel() {
        this.resetForm();
        this.editCanceled.emit();
    }
}
