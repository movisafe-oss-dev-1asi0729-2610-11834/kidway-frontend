import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';

import { AttendanceStore } from '../../../application/state/attendance.store';
import { Attendance } from '../../../domain/entities/attendance.entity';

@Component({
    selector: 'app-attendance-list',
    standalone: true,
    imports: [
        CommonModule, MatTableModule, MatIconModule, MatButtonModule,
        MatTabsModule, MatPaginatorModule, MatCheckboxModule, MatProgressSpinnerModule,
        MatMenuModule, MatSelectModule, MatFormFieldModule, TranslateModule
    ],
    templateUrl: './attendance-list.component.html',
    styleUrl: './attendance-list.component.css'
})
export class AttendanceListComponent {
    readonly store = inject(AttendanceStore);

    displayedColumns: string[] = ['select', 'student', 'route', 'vehicle', 'checkInTime', 'estimatedArrival', 'status', 'actions'];

    searchTerm = signal<string>('');
    selectedTabIndex = signal<number>(0);
    selectedRoute = signal<string>('All');

    uniqueRoutes = computed(() => {
        const routes = this.store.attendance().map(a => a.routeName);
        return ['All', ...new Set(routes)];
    });

    dataSource = computed(() => {
        const attendanceRecords = this.store.attendance();
        const term = this.searchTerm().toLowerCase();
        const tabIndex = this.selectedTabIndex();
        const routeFilter = this.selectedRoute();

        let filtered = attendanceRecords;

        if (routeFilter !== 'All') {
            filtered = filtered.filter(a => a.routeName === routeFilter);
        }

        if (tabIndex === 1) filtered = filtered.filter(a => a.status === 'On board');
        else if (tabIndex === 2) filtered = filtered.filter(a => a.status === 'Boarded');
        else if (tabIndex === 3) filtered = filtered.filter(a => a.status === 'Waiting');
        else if (tabIndex === 4) filtered = filtered.filter(a => a.status === 'Absent');

        if (term) {
            filtered = filtered.filter(a =>
                a.studentName.toLowerCase().includes(term) ||
                a.vehiclePlate.toLowerCase().includes(term)
            );
        }

        return new MatTableDataSource<Attendance>(filtered);
    });

    applySearch(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.searchTerm.set(filterValue);
    }

    markStatus(attendance: Attendance, newStatus: 'On board' | 'Boarded' | 'Absent' | 'Waiting') {
        const checkIn = newStatus === 'On board'
            ? new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})
            : attendance.checkInTime;

        const updatedAttendance = new Attendance({
            id: attendance.id,
            studentName: attendance.studentName,
            studentId: attendance.studentId,
            initials: attendance.initials,
            routeName: attendance.routeName,
            vehiclePlate: attendance.vehiclePlate,
            status: newStatus,
            checkInTime: checkIn,
            estimatedArrival: attendance.estimatedArrival,
            tutorName: attendance.tutorName
        });

        this.store.updateAttendance(updatedAttendance);
    }
}
