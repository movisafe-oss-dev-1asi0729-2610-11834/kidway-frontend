import { Routes } from '@angular/router';
import { NotificationListComponent } from './views/notification-list/notification-list.component';

export const NOTIFICATIONS_ROUTES: Routes = [
  {
    path: '',
    component: NotificationListComponent,
    data: { titleKey: 'notifications.title', boundedContext: 'Alerts', icon: 'notifications' }
  }
];