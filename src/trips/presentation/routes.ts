import { Routes } from '@angular/router';
import { UnderDevelopmentPageComponent } from '../../shared/presentation/pages/under-development/under-development-page.component';

export const TRIPS_ROUTES: Routes = [
  {
    path: '',
    component: UnderDevelopmentPageComponent,
    data: { titleKey: 'nav.trips', boundedContext: 'Trip Management', icon: 'route' }
  }
];
