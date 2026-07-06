import { Component } from '@angular/core';
import { AlertNotificationCenterComponent } from '../alert-notification-center/alert-notification-center.component';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [AlertNotificationCenterComponent],
  template: '<kw-alert-notification-center />'
})
export class NotificationListComponent {}
