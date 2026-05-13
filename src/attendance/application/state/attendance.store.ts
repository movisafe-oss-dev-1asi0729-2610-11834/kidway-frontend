import { computed, Injectable, signal, inject } from '@angular/core';
import { Attendance } from '../../domain/entities/attendance.entity';
import { AttendanceApi } from '../../infrastructure/attendance-api';

@Injectable({ providedIn: 'root' })
export class AttendanceStore {
    private readonly api = inject(AttendanceApi);

    private readonly attendanceSignal = signal<Attendance[]>([]);
    readonly attendance = this.attendanceSignal.asReadonly();

    private readonly loadingSignal = signal<boolean>(false);
    readonly loading = this.loadingSignal.asReadonly();

    private readonly errorSignal = signal<string | null>(null);
    readonly error = this.errorSignal.asReadonly();

    readonly totalInRoute = computed(() => this.attendance().length);
    readonly onBoard = computed(() => this.attendance().filter(a => a.status === 'On board').length);
    readonly waiting = computed(() => this.attendance().filter(a => a.status === 'Waiting').length);
    readonly absent = computed(() => this.attendance().filter(a => a.status === 'Absent').length);

    constructor() {
        this.loadAttendance();
    }

    loadAttendance() {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.api.getAttendance().subscribe({
            next: (data) => {
                this.attendanceSignal.set(data);
                this.loadingSignal.set(false);
            },
            error: () => {
                this.errorSignal.set('Error al cargar la asistencia.');
                this.loadingSignal.set(false);
            }
        });
    }

    updateAttendance(attendance: Attendance) {
        this.loadingSignal.set(true);
        this.api.updateStatus(attendance).subscribe({
            next: (updated) => {
                this.attendanceSignal.update(records =>
                    records.map(a => a.id === updated.id ? updated : a)
                );
                this.loadingSignal.set(false);
            },
            error: () => this.loadingSignal.set(false)
        });
    }
}
