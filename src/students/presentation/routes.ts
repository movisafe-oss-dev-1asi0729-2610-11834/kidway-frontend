import { Routes } from '@angular/router';
import {ParentStudentListComponent} from "./views/parent-student-list/parent-student-list.component";
import {StudentListComponent} from "./views/student-list/student-list.component";

export const STUDENTS_ROUTES: Routes = [
    {
        path: '',
        component: StudentListComponent,
        data: { titleKey: 'nav.students', boundedContext: 'Student Management', icon: 'school' }
    },
    {
        path: 'parent-management',
        component: ParentStudentListComponent,
        data: { titleKey: 'nav.myKids', boundedContext: 'Parent Interface', icon: 'family_restroom' }
    }
];
