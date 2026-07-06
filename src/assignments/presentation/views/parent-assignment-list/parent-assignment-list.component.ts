import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../../identity-access/application/services/auth.service';

import { AssignmentStore } from '../../../application/state/assignment.store';
import { Assignment } from '../../../domain/entities/assignment.entity';


@Component({
    selector: 'app-parent-assignment-list',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatIconModule,
        MatProgressSpinnerModule,
        TranslateModule
    ],
    templateUrl: './parent-assignment-list.component.html',
    styleUrl: './parent-assignment-list.component.css'
})
export class ParentAssignmentListComponent implements OnInit {
    readonly store = inject(AssignmentStore);
    private readonly http = inject(HttpClient);
    private readonly auth = inject(AuthService);

    readonly currentParentName = signal<string>('');
    displayedColumns: string[] = ['kid', 'route', 'vehicle', 'shift', 'status'];

    dataSource = computed(() => {
        const parentName = this.currentParentName();
        const allAssignments = this.store.assignments();

        if (!parentName) return new MatTableDataSource<Assignment>([]);

        const myKidsAssignments = allAssignments.filter(a => a.tutorName === parentName);
        return new MatTableDataSource<Assignment>(myKidsAssignments);
    });

    readonly myKidsCount = computed(() => this.dataSource().data.length);
    ngOnInit() {
        const user = this.auth.currentUser();
        if (user) {
            this.currentParentName.set(`${user.firstName} ${user.lastName}`);
        }
    }
}
