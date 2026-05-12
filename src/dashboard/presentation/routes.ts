import { Routes } from '@angular/router';
import { UnderDevelopmentPageComponent } from '../../shared/presentation/pages/under-development/under-development-page.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: UnderDevelopmentPageComponent,
    data: { titleKey: 'nav.dashboard', boundedContext: 'Dashboard', icon: 'dashboard' }
  }
];
