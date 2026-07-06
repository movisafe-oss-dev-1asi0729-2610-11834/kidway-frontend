import { Routes } from '@angular/router';
import { AssignmentManagementPageComponent } from './views/assignment-management-page/assignment-management-page.component';
import { ParentAssignmentListComponent } from './views/parent-assignment-list/parent-assignment-list.component';

export const ASSIGNMENTS_ROUTES: Routes = [
  {
    path: '',
    component: AssignmentManagementPageComponent,
    data: {
      titleKey: 'assignments.hero.title',
      boundedContext: 'Assignment Management',
      icon: 'assignment_ind'
    }
  },
  {
    path: 'tracking',
    component: ParentAssignmentListComponent,
    data: {
      titleKey: 'assignments.tracking.title',
      boundedContext: 'My Kids Assignments',
      icon: 'family_restroom'
    }
  }
];
