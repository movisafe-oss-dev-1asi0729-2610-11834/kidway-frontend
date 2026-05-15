import { Routes } from '@angular/router';
import { TripListComponent } from './views/trip-list/trip-list.component';

export const TRIPS_ROUTES: Routes = [
  {
    path: '',
    component: TripListComponent,
    // Mantenemos la metadata para que el header y el título se actualicen correctamente
    data: { titleKey: 'trips.title', boundedContext: 'Trip Management', icon: 'route' }
  }
];