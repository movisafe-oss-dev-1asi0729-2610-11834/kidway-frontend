import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { StudentStore } from '../../../application/state/student.store';
import { Student } from '../../../domain/entities/student.entity';
import { StudentFormDialogComponent } from '../../components/student-form-dialog/student-form-dialog.component';
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-parent-student-list',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
    templateUrl: './parent-student-list.component.html',
    styleUrl: './parent-student-list.component.css'
})
export class ParentStudentListComponent implements OnInit {
    readonly store = inject(StudentStore);
    readonly dialog = inject(MatDialog);
    private readonly http = inject(HttpClient);

    readonly currentParentName = signal<string>('');
    readonly myKids = computed(() => {
        const parentName = this.currentParentName();
        if (!parentName) return [];
        return this.store.students().filter(s => s.tutorName === parentName);
    });

    ngOnInit() {
        this.http.get<any>(`${environment.apiBaseUrl}/currentUser`).subscribe({
            next: (user) => {
                if (user) {
                    const fullName = `${user.firstName} ${user.lastName}`;
                    this.currentParentName.set(fullName);
                }
            },
            error: (err) => console.error('Error al cargar el usuario actual:', err)
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
