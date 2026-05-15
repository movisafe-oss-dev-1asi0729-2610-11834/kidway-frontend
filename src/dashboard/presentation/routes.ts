import { Routes } from '@angular/router';
import { DashboardViewComponent } from './views/dashboard-view.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardViewComponent,
    data: { titleKey: 'nav.dashboard', boundedContext: 'Dashboard', icon: 'dashboard' }
  }
];