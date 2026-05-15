export interface AppNotification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  timestamp: Date;
  isRead: boolean;
}