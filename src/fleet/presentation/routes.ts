import { Routes } from '@angular/router';
import { FleetManagementPageComponent } from './views/fleet-management-page/fleet-management-page.component';

export const FLEET_ROUTES: Routes = [
  {
    path: '',
    component: FleetManagementPageComponent,
    title: 'KidWay | Fleet Management'
  }
];
