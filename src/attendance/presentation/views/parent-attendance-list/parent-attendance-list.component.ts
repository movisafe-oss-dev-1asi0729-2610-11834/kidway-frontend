import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../../identity-access/application/services/auth.service';

import { AttendanceStore } from '../../../application/state/attendance.store';
import { Attendance } from '../../../domain/entities/attendance.entity';


@Component({
    selector: 'app-parent-attendance-list',
    standalone: true,
    imports: [CommonModule, MatTableModule, MatIconModule, MatProgressSpinnerModule, TranslateModule],
    templateUrl: './parent-attendance-list.component.html',
    styleUrl: './parent-attendance-list.component.css'
})
export class ParentAttendanceListComponent implements OnInit {
    readonly store = inject(AttendanceStore);
    private readonly http = inject(HttpClient);
    private readonly auth = inject(AuthService);

    readonly currentParentName = signal<string>('');

    displayedColumns: string[] = ['kid', 'transport', 'schedules', 'status'];

    dataSource = computed(() => {
        const parentName = this.currentParentName();
        const allRecords = this.store.attendance();

        if (!parentName) return new MatTableDataSource<Attendance>([]);

        const myKids = allRecords.filter(a => a.tutorName === parentName);
        return new MatTableDataSource<Attendance>(myKids);
    });

    readonly myKidsTotal = computed(() => this.dataSource().data.length);
    readonly myKidsOnBoard = computed(() => this.dataSource().data.filter(a => a.status === 'On board').length);
    readonly myKidsArrived = computed(() => this.dataSource().data.filter(a => a.status === 'Boarded').length);
    ngOnInit() {
        const user = this.auth.currentUser();
        if (user) {
            this.currentParentName.set(`${user.firstName} ${user.lastName}`);
        }
    }
}
