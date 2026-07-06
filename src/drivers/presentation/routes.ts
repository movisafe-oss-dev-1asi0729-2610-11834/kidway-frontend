import { Routes } from '@angular/router';
import { DriverManagementPageComponent } from './views/driver-management-page/driver-management-page.component';

export const DRIVERS_ROUTES: Routes = [
  {
    path: '',
    component: DriverManagementPageComponent
  }
];
