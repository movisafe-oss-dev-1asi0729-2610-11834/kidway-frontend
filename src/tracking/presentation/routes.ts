import { Routes } from '@angular/router';
import { LiveMapComponent } from './views/live-map/live-map.component';

export const TRACKING_ROUTES: Routes = [
  {
    path: '',
    component: LiveMapComponent
  }
];