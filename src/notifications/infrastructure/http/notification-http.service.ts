import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { NotificationCenterDashboard, NotificationItem } from '../../domain/models/notification.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationHttpService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiBaseUrl}/alertNotificationCenter`;

  getDashboard(): Observable<NotificationCenterDashboard> {
    return this.http.get<NotificationCenterDashboard>(this.endpoint).pipe(
      catchError(() => of(this.fallbackDashboard()))
    );
  }

  private fallbackDashboard(): NotificationCenterDashboard {
    const items: NotificationItem[] = [
      {
        id: 'al-001',
        category: 'alert',
        type: 'delay',
        priority: 'high',
        status: 'new',
        title: 'Route delay detected',
        message: 'Vehicle KW-118 is 8 minutes behind schedule on San Isidro Morning Route.',
        time: '7:45 AM',
        date: 'Today',
        sourceBc: 'Trip Management',
        recipientRole: 'Company Admin',
        routeName: 'San Isidro Morning Route',
        vehiclePlate: 'KW-118',
        actionLabel: 'Review delay'
      },
      {
        id: 'nt-001',
        category: 'notification',
        type: 'attendance',
        priority: 'medium',
        status: 'new',
        title: 'Boarding summary ready',
        message: 'Morning attendance was updated for all active routes.',
        time: '7:39 AM',
        date: 'Today',
        sourceBc: 'Attendance Tracking',
        recipientRole: 'Company Admin',
        routeName: 'All morning routes',
        actionLabel: 'Open summary'
      },
      {
        id: 'al-002',
        category: 'alert',
        type: 'incident',
        priority: 'critical',
        status: 'read',
        title: 'Minor incident follow-up',
        message: 'A minor incident report from KW-204 requires company admin review.',
        time: '7:26 AM',
        date: 'Today',
        sourceBc: 'Incident Management',
        recipientRole: 'Company Admin',
        routeName: 'Miraflores School Route',
        vehiclePlate: 'KW-204',
        actionLabel: 'Review incident'
      },
      {
        id: 'nt-002',
        category: 'notification',
        type: 'route',
        priority: 'low',
        status: 'acknowledged',
        title: 'Route checkpoint updated',
        message: 'San Isidro Morning Route confirmed the second checkpoint near Javier Prado.',
        time: '7:12 AM',
        date: 'Today',
        sourceBc: 'Route Management',
        recipientRole: 'Company Admin',
        routeName: 'San Isidro Morning Route',
        vehiclePlate: 'KW-118',
        actionLabel: 'View route'
      },
      {
        id: 'al-003',
        category: 'alert',
        type: 'safety',
        priority: 'medium',
        status: 'new',
        title: 'Speed threshold warning',
        message: 'KW-076 reported a short speed deviation near a school zone.',
        time: '7:04 AM',
        date: 'Today',
        sourceBc: 'Real-Time Tracking',
        recipientRole: 'Company Admin',
        routeName: 'Surco Pickup Route',
        vehiclePlate: 'KW-076',
        actionLabel: 'Check tracking'
      },
      {
        id: 'nt-003',
        category: 'notification',
        type: 'payment',
        priority: 'low',
        status: 'read',
        title: 'Invoice generated',
        message: 'The July subscription invoice is available in Billing & Plans.',
        time: '6:50 AM',
        date: 'Today',
        sourceBc: 'Subscription & Payments',
        recipientRole: 'Company Admin',
        actionLabel: 'Open invoice'
      }
    ];

    return {
      summary: this.summaryFrom(items),
      items,
      activities: [
        { id: 'act-001', time: '7:45 AM', title: 'Delay alert generated', description: 'KW-118 was marked as delayed after ETA recalculation.', status: 'active' },
        { id: 'act-002', time: '7:39 AM', title: 'Attendance notification sent', description: 'Boarding summary was sent to company administrators.', status: 'completed' },
        { id: 'act-003', time: '7:26 AM', title: 'Incident follow-up requested', description: 'KW-204 incident was escalated for operational review.', status: 'pending' }
      ]
    };
  }

  private summaryFrom(items: NotificationItem[]) {
    const unread = items.filter((item) => item.status === 'new').length;
    const criticalAlerts = items.filter((item) => item.category === 'alert' && item.priority === 'critical').length;
    const acknowledged = items.filter((item) => item.status === 'acknowledged').length;
    return {
      total: items.length,
      unread,
      criticalAlerts,
      deliveryRate: 98.4,
      acknowledged
    };
  }
}
