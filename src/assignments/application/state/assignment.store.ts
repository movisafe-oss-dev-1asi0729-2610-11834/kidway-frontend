import { computed, Injectable, signal, inject } from '@angular/core';
import { Assignment } from '../../domain/entities/assignment.entity';
import { AssignmentApi } from '../../infrastructure/assignment-api';

@Injectable({ providedIn: 'root' })
export class AssignmentStore {
    private readonly api = inject(AssignmentApi);

    private readonly assignmentsSignal = signal<Assignment[]>([]);
    readonly assignments = this.assignmentsSignal.asReadonly();

    private readonly loadingSignal = signal<boolean>(false);
    readonly loading = this.loadingSignal.asReadonly();

    private readonly errorSignal = signal<string | null>(null);
    readonly error = this.errorSignal.asReadonly();

    readonly totalAssignments = computed(() => this.assignments().length);
    readonly activeAssignments = computed(() => this.assignments().filter(a => a.status === 'Active').length);
    readonly inactiveAssignments = computed(() => this.assignments().filter(a => a.status === 'Inactive').length);

    constructor() {
        this.loadAssignments();
    }

    loadAssignments() {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.api.getAssignments().subscribe({
            next: (data) => {
                this.assignmentsSignal.set(data);
                this.loadingSignal.set(false);
            },
            error: () => {
                this.errorSignal.set('FAILED_TO_LOAD_ASSIGNMENTS');
                this.loadingSignal.set(false);
            }
        });
    }

    addAssignment(assignment: Assignment) {
        this.loadingSignal.set(true);
        this.api.createAssignment(assignment).subscribe({
            next: (created) => {
                this.assignmentsSignal.update(list => [...list, created]);
                this.loadingSignal.set(false);
            },
            error: () => {
                this.errorSignal.set('FAILED_TO_CREATE_ASSIGNMENT');
                this.loadingSignal.set(false);
            }
        });
    }

    updateAssignment(assignment: Assignment) {
        this.loadingSignal.set(true);
        this.api.updateAssignment(assignment).subscribe({
            next: (updated) => {
                this.assignmentsSignal.update(list =>
                    list.map(a => a.id === updated.id ? updated : a)
                );
                this.loadingSignal.set(false);
            },
            error: () => {
                this.errorSignal.set('FAILED_TO_UPDATE_ASSIGNMENT');
                this.loadingSignal.set(false);
            }
        });
    }

    deleteAssignment(id: number) {
        this.loadingSignal.set(true);
        this.api.deleteAssignment(id).subscribe({
            next: () => {
                this.assignmentsSignal.update(list => list.filter(a => a.id !== id));
                this.loadingSignal.set(false);
            },
            error: () => {
                this.errorSignal.set('FAILED_TO_DELETE_ASSIGNMENT');
                this.loadingSignal.set(false);
            }
        });
    }
}