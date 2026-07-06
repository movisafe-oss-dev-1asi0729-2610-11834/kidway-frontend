import { Routes } from '@angular/router';
import { StudentManagementPageComponent } from './views/student-management-page/student-management-page.component';

export const STUDENTS_ROUTES: Routes = [
  {
    path: '',
    component: StudentManagementPageComponent,
    data: { titleKey: 'nav.students', boundedContext: 'Student Management', icon: 'school' }
  }
];
