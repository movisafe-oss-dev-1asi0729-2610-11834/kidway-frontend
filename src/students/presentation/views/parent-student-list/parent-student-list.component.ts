import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../../identity-access/application/services/auth.service';

import { StudentStore } from '../../../application/state/student.store';
import { Student } from '../../../domain/entities/student.entity';
import { StudentFormDialogComponent } from '../../components/student-form-dialog/student-form-dialog.component';

@Component({
    selector: 'app-parent-student-list',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, TranslateModule],
    templateUrl: './parent-student-list.component.html',
    styleUrl: './parent-student-list.component.css'
})
export class ParentStudentListComponent implements OnInit {
    readonly store = inject(StudentStore);
    readonly dialog = inject(MatDialog);
    private readonly http = inject(HttpClient);
    private readonly auth = inject(AuthService);

    readonly currentParentName = signal<string>('');
    readonly myKids = computed(() => {
        const parentName = this.currentParentName();
        if (!parentName) return [];
        return this.store.students().filter(s => s.tutorName === parentName);
    });
    ngOnInit() {
        const user = this.auth.currentUser();
        if (user) {
            this.currentParentName.set(`${user.firstName} ${user.lastName}`);
        }
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