import { Injectable } from '@angular/core';
import { NotificationHttpService } from '../../infrastructure/http/notification-http.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private httpService: NotificationHttpService) {}

  getAll() {
    return this.httpService.getNotifications();
  }
}