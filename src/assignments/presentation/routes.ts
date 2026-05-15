import { Routes } from '@angular/router';
import {AssignmentListComponent} from "./views/assignment-list/assignment-list.component";
import {ParentAssignmentListComponent} from "./views/parent-assignment-list/parent-assignment-list.component";

export const ASSIGNMENTS_ROUTES: Routes = [
    {//management
        path: '',
        component: AssignmentListComponent,
        data: { titleKey: 'assignments.management.title', boundedContext: 'Assignment Management', icon: 'rule' }
    },
    {//tracking
        path: 'tracking',
        component: ParentAssignmentListComponent,
        data: { titleKey: 'assignments.tracking.title', boundedContext: 'My Kids Assignments', icon: 'family_restroom' }
    }
];
