export type MonitoringStatus = 'healthy' | 'attention' | 'risk';
export type TrendDirection = 'up' | 'down' | 'stable';
export type AnalyticsReportType = 'fleet' | 'trip' | 'attendance' | 'incident' | 'route' | 'service_quality';

export interface AnalyticsSummary {
  totalTrips: number;
  transportedStudents: number;
  onTimeRate: number;
  averageDelayMinutes: number;
  attendanceRate: number;
  serviceQualityScore: number;
  fleetUsage: number;
  incidentRate: number;
}

export interface MonitoringMetric {
  id: string;
  label: string;
  value: string;
  helper: string;
  icon: string;
  status: MonitoringStatus;
  trend: TrendDirection;
}

export interface RoutePerformance {
  id: string;
  routeName: string;
  district: string;
  driverName: string;
  vehiclePlate: string;
  onTimeRate: number;
  attendanceRate: number;
  delayMinutes: number;
  completedTrips: number;
  incidentCount: number;
  serviceScore: number;
  status: MonitoringStatus;
}

export interface AnalyticsInsight {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  source: string;
  action: string;
}

export interface TrendPoint {
  label: string;
  onTimeRate: number;
  attendanceRate: number;
  delayMinutes: number;
}

export interface AnalyticsReport {
  id: string;
  type: AnalyticsReportType;
  title: string;
  period: string;
  generatedAt: string;
  owner: string;
  status: 'ready' | 'scheduled' | 'review';
  records: number;
}

export interface AnalyticsActivity {
  id: string;
  time: string;
  title: string;
  description: string;
  status: MonitoringStatus;
}

export interface AnalyticsDashboard {
  summary: AnalyticsSummary;
  monitoringMetrics: MonitoringMetric[];
  routes: RoutePerformance[];
  insights: AnalyticsInsight[];
  trend: TrendPoint[];
  reports: AnalyticsReport[];
  activities: AnalyticsActivity[];
  lastUpdated: string;
}

// Backward-compatible models retained because older analytics components may still exist
// in some team branches during merge integration.
export interface TripRecord {
  id: string;
  vehicleId: string;
  driverName: string;
  routeName: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  plannedStopCount: number;
  actualStopCount: number;
  onTimeArrivals: number;
  totalDelaysMinutes: number;
  incidentsCount: number;
  fuelConsumptionLiters?: number;
  distanceKm?: number;
}

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  routeId: string;
  date: Date;
  boarded: boolean;
  justifiedAbsence: boolean;
}

export interface IncidentSummary {
  type: string;
  count: number;
}

export interface CompanyMetrics {
  totalTrips: number;
  totalStudents: number;
  avgOnTimeRate: number;
  totalIncidents: number;
  fuelEfficiency?: number;
}

export interface GlobalMetrics {
  totalCompanies: number;
  totalDrivers: number;
  totalVehicles: number;
  totalRoutes: number;
  activeIncidents: number;
  systemHealth: 'healthy' | 'degraded' | 'down';
}
