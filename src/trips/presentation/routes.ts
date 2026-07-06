import { Routes } from '@angular/router';
import { TripManagementPageComponent } from './views/trip-management-page/trip-management-page.component';

export const TRIPS_ROUTES: Routes = [
  {
    path: '',
    component: TripManagementPageComponent,
    data: {
      titleKey: 'tripsBc.title',
      boundedContext: 'Trip Management',
      icon: 'route'
    }
  }
];
