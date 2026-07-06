export type NotificationCategory = 'alert' | 'notification';
export type NotificationType = 'delay' | 'attendance' | 'incident' | 'route' | 'payment' | 'system' | 'safety' | 'maintenance';
export type NotificationPriority = 'critical' | 'high' | 'medium' | 'low';
export type NotificationStatus = 'new' | 'read' | 'acknowledged';

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  title: string;
  message: string;
  time: string;
  date: string;
  sourceBc: string;
  recipientRole: string;
  routeName?: string;
  vehiclePlate?: string;
  studentName?: string;
  actionLabel?: string;
}

export interface NotificationActivity {
  id: string;
  time: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
}

export interface NotificationSummary {
  total: number;
  unread: number;
  criticalAlerts: number;
  deliveryRate: number;
  acknowledged: number;
}

export interface NotificationCenterDashboard {
  summary: NotificationSummary;
  items: NotificationItem[];
  activities: NotificationActivity[];
}
