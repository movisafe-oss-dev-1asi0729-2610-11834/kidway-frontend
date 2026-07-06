import { Routes } from '@angular/router';
import { AlertNotificationCenterComponent } from './views/alert-notification-center/alert-notification-center.component';

export const NOTIFICATIONS_ROUTES: Routes = [
  {
    path: '',
    component: AlertNotificationCenterComponent,
    data: {
      titleKey: 'alertsCenter.hero.title',
      boundedContext: 'Alerts & Notifications',
      icon: 'campaign'
    }
  }
];
