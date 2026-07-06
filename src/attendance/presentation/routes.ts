import { Routes } from '@angular/router';
import { AttendanceManagementPageComponent } from './views/attendance-management-page/attendance-management-page.component';

export const ATTENDANCE_ROUTES: Routes = [
  {
    path: '',
    component: AttendanceManagementPageComponent,
    data: { titleKey: 'nav.attendance', boundedContext: 'Attendance Tracking', icon: 'fact_check' }
  },
  {
    path: 'tracking',
    component: AttendanceManagementPageComponent,
    data: { titleKey: 'nav.attendance', boundedContext: 'Attendance Tracking', icon: 'family_restroom' }
  }
];
