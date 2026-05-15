import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';

import { AssignmentStore } from '../../../application/state/assignment.store';
import { Assignment } from '../../../domain/entities/assignment.entity';
import {
    AssignmentCreateAndEditComponent
} from "../../components/assignment-create-and-edit/assignment-create-and-edit.component";


@Component({
    selector: 'app-assignment-list',
    standalone: true,
    imports: [
        CommonModule, MatTableModule, MatIconModule, MatButtonModule,
        MatPaginatorModule, MatProgressSpinnerModule, MatMenuModule,
        MatSelectModule, MatFormFieldModule, TranslateModule,
        AssignmentCreateAndEditComponent
    ],
    templateUrl: './assignment-list.component.html',
    styleUrl: './assignment-list.component.css'
})
export class AssignmentListComponent {
    readonly store = inject(AssignmentStore);

    displayedColumns: string[] = ['student', 'route', 'vehicle', 'shift', 'status', 'actions'];

    searchTerm = signal<string>('');
    selectedShift = signal<string>('All');
    selectedStatus = signal<string>('All');

    editMode = signal<boolean>(false);
    assignmentToEdit = signal<Assignment | null>(null);

    readonly morningAssignmentsCount = computed(() =>
        this.store.assignments().filter(a => a.shift === 'Morning').length
    );

    dataSource = computed(() => {
        let filtered = this.store.assignments();
        const term = this.searchTerm().toLowerCase();
        const shift = this.selectedShift();
        const status = this.selectedStatus();

        if (shift !== 'All') filtered = filtered.filter(a => a.shift === shift);
        if (status !== 'All') filtered = filtered.filter(a => a.status === status);
        if (term) {
            filtered = filtered.filter(a =>
                a.studentName.toLowerCase().includes(term) ||
                a.routeName.toLowerCase().includes(term) ||
                a.studentId.toLowerCase().includes(term)
            );
        }

        return new MatTableDataSource<Assignment>(filtered);
    });

    applySearch(event: Event) {
        this.searchTerm.set((event.target as HTMLInputElement).value);
    }

    onAddAssignment() {
        this.assignmentToEdit.set(null);
        this.editMode.set(true);
    }

    onEditItem(assignment: Assignment) {
        this.assignmentToEdit.set(assignment);
        this.editMode.set(true);
    }

    onEditCanceled() {
        this.editMode.set(false);
        this.assignmentToEdit.set(null);
    }

    onEditSaved(assignment: Assignment) {
        if (assignment.id === 0) {
            const newAssignment = new Assignment({
                id: new Date().getTime(),
                studentName: assignment.studentName,
                studentId: assignment.studentId,
                routeName: assignment.routeName,
                vehiclePlate: assignment.vehiclePlate,
                shift: assignment.shift as 'Morning' | 'Afternoon',
                status: assignment.status as 'Active' | 'Inactive',
                tutorName: assignment.tutorName
            });
            this.store.addAssignment(newAssignment);
        } else {
            this.store.updateAssignment(assignment);
        }
        this.editMode.set(false);
        this.assignmentToEdit.set(null);
    }

    toggleStatus(assignment: Assignment) {
        const updatedAssignment = new Assignment({
            id: assignment.id,
            studentName: assignment.studentName,
            studentId: assignment.studentId,
            routeName: assignment.routeName,
            vehiclePlate: assignment.vehiclePlate,
            shift: assignment.shift as 'Morning' | 'Afternoon',
            status: assignment.status === 'Active' ? 'Inactive' : 'Active',
            tutorName: assignment.tutorName
        });
        this.store.updateAssignment(updatedAssignment);
    }

    deleteAssignment(id: number) {
        this.store.deleteAssignment(id);
    }
}