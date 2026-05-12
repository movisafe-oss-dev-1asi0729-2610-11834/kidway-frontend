import { Routes } from '@angular/router';
import { UnderDevelopmentPageComponent } from '../../shared/presentation/pages/under-development/under-development-page.component';

export const DRIVERS_ROUTES: Routes = [
  {
    path: '',
    component: UnderDevelopmentPageComponent,
    data: { titleKey: 'nav.drivers', boundedContext: 'Driver Management', icon: 'badge' }
  }
];
