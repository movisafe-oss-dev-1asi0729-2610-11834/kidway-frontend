import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { StudentStore } from '../../../application/state/student.store';
import { Student } from '../../../domain/entities/student.entity';
import { StudentFormDialogComponent } from '../../components/student-form-dialog/student-form-dialog.component';
import {StudentDetailDialogComponent} from "../../components/student-dialog";

@Component({
    selector: 'app-student-list',
    standalone: true,
    imports: [
        CommonModule, MatTableModule, MatIconModule, MatButtonModule,
        MatTabsModule, MatPaginatorModule, MatCheckboxModule, MatProgressSpinnerModule, MatError
    ],
    templateUrl: './student-list.component.html',
    styleUrl: './student-list.component.css'
})
export class StudentListComponent {
    readonly store = inject(StudentStore);
    readonly dialog = inject(MatDialog);

    displayedColumns: string[] = ['select', 'alumno', 'grado', 'tutor', 'contacto', 'ruta', 'parada', 'estado', 'acciones'];

    searchTerm = signal<string>('');
    selectedTabIndex = signal<number>(0);

    dataSource = computed(() => {
        const students = this.store.students();
        const term = this.searchTerm().toLowerCase();
        const tabIndex = this.selectedTabIndex();

        let filteredStudents = students;

        if (tabIndex === 1) {
            filteredStudents = filteredStudents.filter(s => s.routeAssigned !== null);
        } else if (tabIndex === 2) {
            filteredStudents = filteredStudents.filter(s => s.routeAssigned === null);
        } else if (tabIndex === 3) {
            filteredStudents = filteredStudents.filter(s => s.status === 'Inactivo');
        }

        if (term) {
            filteredStudents = filteredStudents.filter(s =>
                s.fullName.toLowerCase().includes(term) ||
                s.tutorName.toLowerCase().includes(term)
            );
        }

        return new MatTableDataSource<Student>(filteredStudents);
    });

    applySearch(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.searchTerm.set(filterValue);
    }
    goToSinRutaTab() {
        this.selectedTabIndex.set(2);
    }
    openDetailDialog(student: Student) {
        this.dialog.open(StudentDetailDialogComponent, {
            data: student,
            width: '450px'
        });
    }
    openCreateDialog() {
        const dialogRef = this.dialog.open(StudentFormDialogComponent, {
            width: '450px',
            data: null
        });

        dialogRef.afterClosed().subscribe((result: Student) => {
            if (result) {
                this.store.createStudent(result);
            }
        });
    }
    openEditDialog(student: Student) {
        const dialogRef = this.dialog.open(StudentFormDialogComponent, {
            width: '450px',
            data: student
        });

        dialogRef.afterClosed().subscribe((result: Student) => {
            if (result) {
                this.store.updateStudent(result);
            }
        });
    }
}
