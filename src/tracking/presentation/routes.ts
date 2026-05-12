import { Routes } from '@angular/router';
import { UnderDevelopmentPageComponent } from '../../shared/presentation/pages/under-development/under-development-page.component';

export const TRACKING_ROUTES: Routes = [
  {
    path: '',
    component: UnderDevelopmentPageComponent,
    data: { titleKey: 'nav.tracking', boundedContext: 'Real-Time Tracking', icon: 'location_on' }
  }
];
