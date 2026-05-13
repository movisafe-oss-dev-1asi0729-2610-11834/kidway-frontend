import { Routes } from '@angular/router';
import {AttendanceListComponent} from "./views/attendance-list/attendance-list.component";
import {ParentAttendanceListComponent} from "./views/parent-attendance-list/parent-attendance-list.component";

export const ATTENDANCE_ROUTES: Routes = [
    {//management
        path: '',
        component: AttendanceListComponent,
        data: { titleKey: 'nav.attendance_mgmt', boundedContext: 'Attendance Tracking', icon: 'fact_check' }
    },
    {//tracking
        path: 'tracking',
        component: ParentAttendanceListComponent,
        data: { titleKey: 'nav.attendance_tracking', boundedContext: 'My Kids Tracking', icon: 'family_restroom' }
    }
];

