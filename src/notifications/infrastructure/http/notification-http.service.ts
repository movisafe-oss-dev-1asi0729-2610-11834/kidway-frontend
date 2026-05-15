import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { AppNotification } from '../../domain/models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationHttpService {
  private mockNotifications: AppNotification[] = [
    { id: 1, title: 'Retraso detectado', message: 'La unidad BUS-101 tiene un retraso de 10 min.', type: 'warning', timestamp: new Date(), isRead: false },
    { id: 2, title: 'Ruta iniciada', message: 'El conductor Juan Pérez ha iniciado su ruta.', type: 'info', timestamp: new Date(), isRead: true },
    { id: 3, title: 'Alerta de Velocidad', message: 'La unidad XYZ-789 superó los 60km/h en zona escolar.', type: 'danger', timestamp: new Date(), isRead: false }
  ];

  getNotifications(): Observable<AppNotification[]> {
    return of(this.mockNotifications).pipe(delay(400));
  }
}