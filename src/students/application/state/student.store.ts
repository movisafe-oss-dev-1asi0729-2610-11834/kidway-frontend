import { computed, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {Student} from "../../domain/entities/student.entity";
import {StudentsApi} from "../../infrastructure/students-api";


@Injectable({ providedIn: 'root' })
export class StudentStore {
    private readonly studentsSignal = signal<Student[]>([]);
    readonly students = this.studentsSignal.asReadonly();

    private readonly loadingSignal = signal<boolean>(false);
    readonly loading = this.loadingSignal.asReadonly();

    private readonly errorSignal = signal<string | null>(null);
    readonly error = this.errorSignal.asReadonly();

    readonly totalStudents = computed(() => this.students().length);
    readonly studentsWithRoute = computed(() => this.students().filter(s => s.routeAssigned !== null).length);
    readonly studentsWithoutRoute = computed(() => this.students().filter(s => s.routeAssigned === null).length);
    readonly inactiveStudents = computed(() => this.students().filter(s => s.status === 'Inactivo').length);

    constructor(private studentsApi: StudentsApi) {
        this.loadStudents();
    }

    private loadStudents(): void {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);

        this.studentsApi.getStudents().pipe(takeUntilDestroyed()).subscribe({
            next: (students) => {
                this.studentsSignal.set(students);
                this.loadingSignal.set(false);
            },
            error: (err) => {
                this.errorSignal.set('Error cargando los estudiantes. Verifica json-server.');
                this.loadingSignal.set(false);
            }
        });
    }

    updateStudentInStore(updatedStudent: Student): void {
        this.studentsSignal.update(students =>
            students.map(student => student.id === updatedStudent.id ? updatedStudent : student)
        );
    }
    createStudent(student: Student): void {
        this.loadingSignal.set(true);
        this.studentsApi.createStudent(student).subscribe({
            next: (newStudent) => {
                this.studentsSignal.update(students => [...students, newStudent]);
                this.loadingSignal.set(false);
            },
            error: () => {
                this.errorSignal.set('Error al registrar el alumno');
                this.loadingSignal.set(false);
            }
        });
    }

    updateStudent(student: Student): void {
        this.loadingSignal.set(true);
        this.studentsApi.updateStudent(student).subscribe({
            next: (updated) => {
                this.studentsSignal.update(students =>
                    students.map(s => s.id === updated.id ? updated : s)
                );
                this.loadingSignal.set(false);
            },
            error: () => {
                this.errorSignal.set('Error al actualizar el alumno');
                this.loadingSignal.set(false);
            }
        });
    }
}
