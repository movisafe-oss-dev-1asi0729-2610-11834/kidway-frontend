export type DashboardRole = 'operator' | 'company' | 'admin';
export type VehicleStatus = 'on-route' | 'delayed' | 'stopped' | 'emergency' | 'available';
export type AlertType = 'delay' | 'deviation' | 'incident' | 'emergency' | 'attendance' | 'system';
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';
export type TrendDirection = 'up' | 'down' | 'stable';

export interface DashboardMetric {
  id: string;
  icon: string;
  value: string;
  labelKey: string;
  helperKey: string;
  trend?: string;
  trendDirection?: TrendDirection;
}

export interface Vehicle {
  id: string;
  plate: string;
  driverName: string;
  lat: number;
  lng: number;
  status: VehicleStatus;
  route: string;
  students: number;
  etaMinutes: number;
  lastUpdate: string;
}

export interface DashboardAlert {
  id: number;
  type: AlertType;
  priority: AlertPriority;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedVehicle?: string;
}

export interface OperationItem {
  id: string;
  label: string;
  value: string;
  helper: string;
  progress: number;
  icon: string;
}

export interface DashboardActivity {
  id: string;
  time: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'warning';
}

export interface DashboardOverview {
  role: DashboardRole;
  titleKey: string;
  subtitleKey: string;
  heroValue: string;
  heroLabelKey: string;
  metrics: DashboardMetric[];
  vehicles: Vehicle[];
  alerts: DashboardAlert[];
  operationItems: OperationItem[];
  activities: DashboardActivity[];
}
