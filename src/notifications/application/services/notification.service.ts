import { Injectable, computed, inject, signal } from '@angular/core';
import { NotificationHttpService } from '../../infrastructure/http/notification-http.service';
import { NotificationActivity, NotificationCategory, NotificationCenterDashboard, NotificationItem, NotificationPriority, NotificationStatus } from '../../domain/models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly httpService = inject(NotificationHttpService);
  private readonly itemsState = signal<NotificationItem[]>([]);
  private readonly activitiesState = signal<NotificationActivity[]>([]);
  private loaded = false;

  readonly items = this.itemsState.asReadonly();
  readonly activities = this.activitiesState.asReadonly();
  readonly unreadCount = computed(() => this.items().filter((item) => item.status === 'new').length);
  readonly topbarItems = computed(() => this.items().slice(0, 4));
  readonly alertItems = computed(() => this.items().filter((item) => item.category === 'alert'));
  readonly notificationItems = computed(() => this.items().filter((item) => item.category === 'notification'));
  readonly summary = computed(() => this.buildSummary(this.items()));

  load(force = false): void {
    if (this.loaded && !force) return;
    this.loaded = true;
    this.httpService.getDashboard().subscribe((dashboard: NotificationCenterDashboard) => {
      this.itemsState.set(dashboard.items ?? []);
      this.activitiesState.set(dashboard.activities ?? []);
    });
  }

  filteredItems(category: 'all' | NotificationCategory, priority: 'all' | NotificationPriority, status: 'all' | NotificationStatus, query: string): NotificationItem[] {
    const normalizedQuery = query.trim().toLowerCase();
    return this.items().filter((item) => {
      const matchesCategory = category === 'all' || item.category === category;
      const matchesPriority = priority === 'all' || item.priority === priority;
      const matchesStatus = status === 'all' || item.status === status;
      const searchable = `${item.title} ${item.message} ${item.routeName ?? ''} ${item.vehiclePlate ?? ''} ${item.sourceBc}`.toLowerCase();
      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
      return matchesCategory && matchesPriority && matchesStatus && matchesQuery;
    });
  }

  markAsRead(id: string): void {
    this.updateItem(id, { status: 'read' });
  }

  acknowledge(id: string): void {
    this.updateItem(id, { status: 'acknowledged' });
  }

  markAllAsRead(): void {
    this.itemsState.update((items) => items.map((item) => item.status === 'new' ? { ...item, status: 'read' } : item));
  }

  remove(id: string): void {
    this.itemsState.update((items) => items.filter((item) => item.id !== id));
  }

  exportCsv(items: NotificationItem[]): void {
    const header = ['id', 'category', 'priority', 'status', 'title', 'sourceBc', 'vehiclePlate', 'routeName', 'time'];
    const rows = items.map((item) => [
      item.id,
      item.category,
      item.priority,
      item.status,
      item.title,
      item.sourceBc,
      item.vehiclePlate ?? '',
      item.routeName ?? '',
      item.time
    ]);
    const csv = [header, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'kidway-alerts-notifications.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  iconFor(item: NotificationItem): string {
    const iconMap: Record<string, string> = {
      delay: 'schedule',
      attendance: 'fact_check',
      incident: 'report_problem',
      route: 'alt_route',
      payment: 'payments',
      system: 'settings',
      safety: 'health_and_safety',
      maintenance: 'construction'
    };
    return iconMap[item.type] ?? 'notifications';
  }

  private updateItem(id: string, changes: Partial<NotificationItem>): void {
    this.itemsState.update((items) => items.map((item) => item.id === id ? { ...item, ...changes } : item));
  }

  private buildSummary(items: NotificationItem[]) {
    return {
      total: items.length,
      unread: items.filter((item) => item.status === 'new').length,
      criticalAlerts: items.filter((item) => item.category === 'alert' && item.priority === 'critical').length,
      deliveryRate: 98.4,
      acknowledged: items.filter((item) => item.status === 'acknowledged').length
    };
  }
}
