import { Routes } from '@angular/router';
import { AnalyticsViewComponent } from './views/analytics-view.component';

export const ANALYTICS_ROUTES: Routes = [
  {
    path: '',
    component: AnalyticsViewComponent,
    data: { titleKey: 'nav.analytics', boundedContext: 'Monitoring & Analytics', icon: 'bar_chart' }
  }
];
