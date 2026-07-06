import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import {
  AnalyticsActivity,
  AnalyticsDashboard,
  AnalyticsInsight,
  AnalyticsReport,
  AnalyticsReportType,
  AnalyticsSummary,
  MonitoringMetric,
  MonitoringStatus,
  RoutePerformance,
  TrendPoint
} from '../../domain/models/analytics.model';
import { AnalyticsHttpService } from '../../infrastructure/http/analytics-http.service';

@Injectable({ providedIn: 'root' })
export class AnalyticsManagementService {
  private readonly analyticsHttp = inject(AnalyticsHttpService);

  readonly query = signal('');
  readonly reportType = signal<'all' | AnalyticsReportType>('all');
  readonly routeStatus = signal<'all' | MonitoringStatus>('all');
  readonly selectedRouteId = signal('rt-001');

  readonly dashboard = signal<AnalyticsDashboard>(this.defaultDashboard());

  readonly summary = computed(() => this.dashboard().summary);
  readonly selectedRoute = computed(() => {
    const routes = this.dashboard().routes;
    return routes.find((route) => route.id === this.selectedRouteId()) ?? routes[0];
  });

  readonly filteredRoutes = computed(() => {
    const normalizedQuery = this.query().trim().toLowerCase();
    const status = this.routeStatus();

    return this.dashboard().routes.filter((route) => {
      const matchesStatus = status === 'all' || route.status === status;
      const matchesQuery = !normalizedQuery || [
        route.routeName,
        route.district,
        route.driverName,
        route.vehiclePlate
      ].some((value) => value.toLowerCase().includes(normalizedQuery));

      return matchesStatus && matchesQuery;
    });
  });

  readonly filteredReports = computed(() => {
    const type = this.reportType();
    return this.dashboard().reports.filter((report) => type === 'all' || report.type === type);
  });

  constructor() {
    this.refreshDashboard();
  }

  refreshDashboard(): void {
    this.analyticsHttp.getDashboard().pipe(
      catchError(() => of(this.defaultDashboard()))
    ).subscribe((dashboard) => {
      this.dashboard.set({ ...dashboard, lastUpdated: new Date().toISOString() });
      if (!dashboard.routes.some((route) => route.id === this.selectedRouteId())) {
        this.selectedRouteId.set(dashboard.routes[0]?.id ?? '');
      }
    });
  }

  selectRoute(routeId: string): void {
    this.selectedRouteId.set(routeId);
  }

  setReportType(type: 'all' | AnalyticsReportType): void {
    this.reportType.set(type);
  }

  setRouteStatus(status: 'all' | MonitoringStatus): void {
    this.routeStatus.set(status);
    const firstRoute = this.filteredRoutes()[0];
    if (firstRoute) this.selectRoute(firstRoute.id);
  }

  generateReport(): void {
    const nextReport: AnalyticsReport = {
      id: `rep-${Date.now()}`,
      type: 'service_quality',
      title: 'Service quality snapshot',
      period: 'Current operational day',
      generatedAt: new Date().toISOString(),
      owner: 'Company Admin',
      status: 'ready',
      records: this.dashboard().routes.length
    };

    const nextActivity: AnalyticsActivity = {
      id: `act-${Date.now()}`,
      time: new Date().toISOString(),
      title: 'Analytics report generated',
      description: 'A service quality report was generated from current monitoring indicators.',
      status: 'healthy'
    };

    this.dashboard.update((current) => ({
      ...current,
      reports: [nextReport, ...current.reports],
      activities: [nextActivity, ...current.activities],
      lastUpdated: new Date().toISOString()
    }));
  }

  exportCsv(): void {
    const headers = ['Route', 'District', 'Driver', 'Vehicle', 'On-time %', 'Attendance %', 'Delay minutes', 'Incidents', 'Score'];
    const rows = this.filteredRoutes().map((route) => [
      route.routeName,
      route.district,
      route.driverName,
      route.vehiclePlate,
      String(route.onTimeRate),
      String(route.attendanceRate),
      String(route.delayMinutes),
      String(route.incidentCount),
      String(route.serviceScore)
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kidway-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  statusIcon(status: MonitoringStatus): string {
    const iconMap: Record<MonitoringStatus, string> = {
      healthy: 'check_circle',
      attention: 'pending_actions',
      risk: 'warning'
    };
    return iconMap[status];
  }

  reportTypeIcon(type: AnalyticsReportType): string {
    const iconMap: Record<AnalyticsReportType, string> = {
      fleet: 'directions_bus',
      trip: 'route',
      attendance: 'fact_check',
      incident: 'report_problem',
      route: 'alt_route',
      service_quality: 'monitoring'
    };
    return iconMap[type];
  }

  private defaultDashboard(): AnalyticsDashboard {
    const summary: AnalyticsSummary = {
      totalTrips: 184,
      transportedStudents: 2450,
      onTimeRate: 91,
      averageDelayMinutes: 7,
      attendanceRate: 96.8,
      serviceQualityScore: 93,
      fleetUsage: 88,
      incidentRate: 1.8
    };

    const monitoringMetrics: MonitoringMetric[] = [
      { id: 'm1', label: 'Active monitored routes', value: '14', helper: 'Routes sending operational data', icon: 'route', status: 'healthy', trend: 'up' },
      { id: 'm2', label: 'Live tracking sessions', value: '12', helper: 'Vehicles currently reporting GPS', icon: 'gps_fixed', status: 'healthy', trend: 'stable' },
      { id: 'm3', label: 'Attention signals', value: '3', helper: 'Delays, incidents or attendance gaps', icon: 'notification_important', status: 'attention', trend: 'down' },
      { id: 'm4', label: 'Service quality score', value: '93%', helper: 'Combined punctuality and safety score', icon: 'verified', status: 'healthy', trend: 'up' },
      { id: 'm5', label: 'Average delay', value: '7 min', helper: 'Current school transport day', icon: 'schedule', status: 'attention', trend: 'down' }
    ];

    const routes: RoutePerformance[] = [
      { id: 'rt-001', routeName: 'Miraflores School Route', district: 'Miraflores', driverName: 'Carlos Pérez', vehiclePlate: 'KW-204', onTimeRate: 96, attendanceRate: 98, delayMinutes: 4, completedTrips: 42, incidentCount: 0, serviceScore: 97, status: 'healthy' },
      { id: 'rt-002', routeName: 'San Isidro Morning Route', district: 'San Isidro', driverName: 'María Gómez', vehiclePlate: 'KW-118', onTimeRate: 87, attendanceRate: 95, delayMinutes: 12, completedTrips: 39, incidentCount: 1, serviceScore: 89, status: 'attention' },
      { id: 'rt-003', routeName: 'Surco Pickup Route', district: 'Santiago de Surco', driverName: 'Luis Torres', vehiclePlate: 'KW-076', onTimeRate: 78, attendanceRate: 92, delayMinutes: 18, completedTrips: 36, incidentCount: 2, serviceScore: 82, status: 'risk' },
      { id: 'rt-004', routeName: 'La Molina Afternoon Route', district: 'La Molina', driverName: 'Andrea Rojas', vehiclePlate: 'KW-311', onTimeRate: 94, attendanceRate: 97, delayMinutes: 6, completedTrips: 41, incidentCount: 0, serviceScore: 95, status: 'healthy' }
    ];

    const insights: AnalyticsInsight[] = [
      { id: 'i1', title: 'Surco route requires optimization', description: 'Delay minutes increased during the last three service days.', impact: 'high', source: 'Route and trip analytics', action: 'Review stop sequence' },
      { id: 'i2', title: 'Attendance confirmation is stable', description: 'Guardian notification confirmations improved after morning dispatch.', impact: 'medium', source: 'Attendance tracking', action: 'Keep current notification timing' },
      { id: 'i3', title: 'Fleet usage remains healthy', description: 'Most vehicles are operating below the configured capacity limit.', impact: 'low', source: 'Fleet monitoring', action: 'Continue monitoring capacity' }
    ];

    const trend: TrendPoint[] = [
      { label: 'Mon', onTimeRate: 89, attendanceRate: 96, delayMinutes: 10 },
      { label: 'Tue', onTimeRate: 91, attendanceRate: 95, delayMinutes: 8 },
      { label: 'Wed', onTimeRate: 87, attendanceRate: 94, delayMinutes: 12 },
      { label: 'Thu', onTimeRate: 93, attendanceRate: 97, delayMinutes: 6 },
      { label: 'Fri', onTimeRate: 95, attendanceRate: 98, delayMinutes: 5 }
    ];

    const reports: AnalyticsReport[] = [
      { id: 'r1', type: 'fleet', title: 'Fleet usage report', period: 'Current week', generatedAt: '2026-07-05T16:20:00.000Z', owner: 'Company Admin', status: 'ready', records: 25 },
      { id: 'r2', type: 'trip', title: 'Trip performance report', period: 'Current week', generatedAt: '2026-07-05T15:45:00.000Z', owner: 'Operations', status: 'ready', records: 184 },
      { id: 'r3', type: 'attendance', title: 'Attendance reliability report', period: 'Current month', generatedAt: '2026-07-04T18:10:00.000Z', owner: 'Company Admin', status: 'review', records: 2450 },
      { id: 'r4', type: 'incident', title: 'Incident follow-up report', period: 'Current month', generatedAt: '2026-07-04T17:00:00.000Z', owner: 'Safety coordinator', status: 'scheduled', records: 5 }
    ];

    const activities: AnalyticsActivity[] = [
      { id: 'a1', time: '2026-07-05T07:45:00.000Z', title: 'Monitoring snapshot updated', description: 'Live indicators were refreshed from tracking, trips and attendance.', status: 'healthy' },
      { id: 'a2', time: '2026-07-05T07:38:00.000Z', title: 'Delay trend detected', description: 'Surco Pickup Route exceeded the normal delay threshold.', status: 'attention' },
      { id: 'a3', time: '2026-07-05T07:25:00.000Z', title: 'Incident rate reviewed', description: 'Incident count remains under the configured operational risk limit.', status: 'healthy' }
    ];

    return {
      summary,
      monitoringMetrics,
      routes,
      insights,
      trend,
      reports,
      activities,
      lastUpdated: '2026-07-05T07:45:00.000Z'
    };
  }
}
