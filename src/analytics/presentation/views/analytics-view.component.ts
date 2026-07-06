import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsManagementService } from '../../application/services/analytics-management.service';
import { AnalyticsReportType, MonitoringStatus, RoutePerformance } from '../../domain/models/analytics.model';

@Component({
  selector: 'kw-analytics-view',
  standalone: true,
  imports: [NgClass, DatePipe, TranslateModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <section class="analytics-page">
      <header class="hero-card">
        <div>
          <span class="eyebrow">{{ 'analyticsBc.hero.eyebrow' | translate }}</span>
          <h1>{{ 'analyticsBc.hero.title' | translate }}</h1>
          <p>{{ 'analyticsBc.hero.subtitle' | translate }}</p>
        </div>
        <aside class="hero-badge">
          <span>{{ 'analyticsBc.hero.score' | translate }}</span>
          <strong>{{ service.summary().serviceQualityScore }}%</strong>
        </aside>
      </header>

      <div class="metric-grid">
        <article class="metric-card">
          <span class="metric-icon blue"><mat-icon>route</mat-icon></span>
          <small>{{ 'analyticsBc.metrics.totalTrips' | translate }}</small>
          <strong>{{ service.summary().totalTrips }}</strong>
          <p>{{ 'analyticsBc.metrics.totalTripsHint' | translate }}</p>
        </article>
        <article class="metric-card">
          <span class="metric-icon green"><mat-icon>fact_check</mat-icon></span>
          <small>{{ 'analyticsBc.metrics.attendance' | translate }}</small>
          <strong>{{ service.summary().attendanceRate }}%</strong>
          <p>{{ 'analyticsBc.metrics.attendanceHint' | translate }}</p>
        </article>
        <article class="metric-card">
          <span class="metric-icon amber"><mat-icon>schedule</mat-icon></span>
          <small>{{ 'analyticsBc.metrics.delay' | translate }}</small>
          <strong>{{ service.summary().averageDelayMinutes }} min</strong>
          <p>{{ 'analyticsBc.metrics.delayHint' | translate }}</p>
        </article>
        <article class="metric-card">
          <span class="metric-icon cyan"><mat-icon>directions_bus</mat-icon></span>
          <small>{{ 'analyticsBc.metrics.fleetUsage' | translate }}</small>
          <strong>{{ service.summary().fleetUsage }}%</strong>
          <p>{{ 'analyticsBc.metrics.fleetUsageHint' | translate }}</p>
        </article>
        <article class="metric-card">
          <span class="metric-icon red"><mat-icon>report_problem</mat-icon></span>
          <small>{{ 'analyticsBc.metrics.incidentRate' | translate }}</small>
          <strong>{{ service.summary().incidentRate }}%</strong>
          <p>{{ 'analyticsBc.metrics.incidentRateHint' | translate }}</p>
        </article>
      </div>

      <div class="command-banner">
        <span><mat-icon>monitoring</mat-icon></span>
        <div>
          <strong>{{ 'analyticsBc.banner.title' | translate }}</strong>
          <p>{{ 'analyticsBc.banner.message' | translate }}</p>
        </div>
        <button type="button" (click)="service.refreshDashboard()"><mat-icon>sync</mat-icon>{{ 'analyticsBc.actions.refresh' | translate }}</button>
      </div>

      <section class="monitoring-grid">
        <article class="center-card live-card">
          <div class="section-head">
            <div>
              <span class="eyebrow">{{ 'analyticsBc.sections.monitoringEyebrow' | translate }}</span>
              <h2>{{ 'analyticsBc.sections.monitoringTitle' | translate }}</h2>
            </div>
            <span class="count-pill">{{ 'analyticsBc.labels.updated' | translate }} {{ service.dashboard().lastUpdated | date:'shortTime' }}</span>
          </div>

          <div class="monitoring-list">
            @for (metric of service.dashboard().monitoringMetrics; track metric.id) {
              <article class="monitoring-item" [ngClass]="metric.status">
                <span class="monitor-icon" [ngClass]="metric.status"><mat-icon>{{ metric.icon }}</mat-icon></span>
                <div>
                  <strong>{{ metric.label }}</strong>
                  <p>{{ metric.helper }}</p>
                </div>
                <strong class="monitor-value">{{ metric.value }}</strong>
                <mat-icon class="trend" [ngClass]="metric.trend">{{ trendIcon(metric.trend) }}</mat-icon>
              </article>
            }
          </div>
        </article>

        <aside class="center-card score-card">
          <div class="section-head compact">
            <div>
              <span class="eyebrow">{{ 'analyticsBc.sections.analyticsEyebrow' | translate }}</span>
              <h2>{{ 'analyticsBc.sections.qualityTitle' | translate }}</h2>
            </div>
            <span class="count-pill">{{ service.summary().serviceQualityScore }}%</span>
          </div>
          <div class="donut" [style.background]="donutStyle(service.summary().serviceQualityScore)">
            <div>
              <strong>{{ service.summary().serviceQualityScore }}%</strong>
              <span>{{ 'analyticsBc.labels.safeService' | translate }}</span>
            </div>
          </div>
          <div class="legend-row">
            <span><i class="green-dot"></i>{{ 'analyticsBc.labels.monitoring' | translate }}</span>
            <span><i class="blue-dot"></i>{{ 'analyticsBc.labels.analytics' | translate }}</span>
            <span><i class="amber-dot"></i>{{ 'analyticsBc.labels.reports' | translate }}</span>
          </div>
        </aside>
      </section>

      <section class="content-grid">
        <article class="center-card route-card">
          <div class="section-head">
            <div>
              <span class="eyebrow">{{ 'analyticsBc.sections.routeEyebrow' | translate }}</span>
              <h2>{{ 'analyticsBc.sections.routeTitle' | translate }}</h2>
            </div>
            <button mat-flat-button type="button" class="primary-action" (click)="service.exportCsv()">
              <mat-icon>download</mat-icon>{{ 'analyticsBc.actions.export' | translate }}
            </button>
          </div>

          <div class="filters-row">
            <label class="search-control">
              <mat-icon>search</mat-icon>
              <input type="search" [placeholder]="'analyticsBc.filters.search' | translate" [value]="service.query()" (input)="service.query.set($any($event.target).value)">
            </label>
            <div class="chip-row">
              @for (option of statusOptions; track option.value) {
                <button type="button" [class.active]="service.routeStatus() === option.value" (click)="service.setRouteStatus(option.value)">
                  <mat-icon>{{ option.icon }}</mat-icon>{{ option.labelKey | translate }}
                </button>
              }
            </div>
          </div>

          <div class="route-list">
            @for (route of service.filteredRoutes(); track route.id) {
              <article class="route-row" [class.selected]="service.selectedRoute().id === route.id" [ngClass]="route.status" (click)="service.selectRoute(route.id)">
                <span class="route-icon" [ngClass]="route.status"><mat-icon>{{ service.statusIcon(route.status) }}</mat-icon></span>
                <div class="route-main">
                  <div class="route-title">
                    <div>
                      <strong>{{ route.routeName }}</strong>
                      <p>{{ route.district }} · {{ route.driverName }} · {{ route.vehiclePlate }}</p>
                    </div>
                    <span class="status-pill" [ngClass]="route.status">{{ statusLabel(route.status) | translate }}</span>
                  </div>
                  <div class="route-bars">
                    <div>
                      <span>{{ 'analyticsBc.labels.onTime' | translate }}</span>
                      <strong>{{ route.onTimeRate }}%</strong>
                      <i><em [style.width.%]="route.onTimeRate"></em></i>
                    </div>
                    <div>
                      <span>{{ 'analyticsBc.labels.attendance' | translate }}</span>
                      <strong>{{ route.attendanceRate }}%</strong>
                      <i><em [style.width.%]="route.attendanceRate"></em></i>
                    </div>
                    <div>
                      <span>{{ 'analyticsBc.labels.score' | translate }}</span>
                      <strong>{{ route.serviceScore }}%</strong>
                      <i><em [style.width.%]="route.serviceScore"></em></i>
                    </div>
                  </div>
                </div>
                <button mat-icon-button type="button" aria-label="Select route" (click)="service.selectRoute(route.id); $event.stopPropagation()"><mat-icon>arrow_forward</mat-icon></button>
              </article>
            } @empty {
              <div class="empty-state"><mat-icon>query_stats</mat-icon><strong>{{ 'analyticsBc.empty.title' | translate }}</strong><p>{{ 'analyticsBc.empty.message' | translate }}</p></div>
            }
          </div>
        </article>

        <aside class="side-stack">
          <article class="center-card detail-panel">
            <div class="section-head compact">
              <div>
                <span class="eyebrow">{{ 'analyticsBc.sections.selectedEyebrow' | translate }}</span>
                <h2>{{ 'analyticsBc.sections.selectedTitle' | translate }}</h2>
              </div>
            </div>
            @if (service.selectedRoute(); as route) {
              <div class="selected-route" [ngClass]="route.status">
                <span class="route-icon large" [ngClass]="route.status"><mat-icon>{{ service.statusIcon(route.status) }}</mat-icon></span>
                <h3>{{ route.routeName }}</h3>
                <p>{{ route.district }} · {{ route.driverName }}</p>
                <dl>
                  <div><dt>{{ 'analyticsBc.detail.vehicle' | translate }}</dt><dd>{{ route.vehiclePlate }}</dd></div>
                  <div><dt>{{ 'analyticsBc.detail.completedTrips' | translate }}</dt><dd>{{ route.completedTrips }}</dd></div>
                  <div><dt>{{ 'analyticsBc.detail.delayMinutes' | translate }}</dt><dd>{{ route.delayMinutes }} min</dd></div>
                  <div><dt>{{ 'analyticsBc.detail.incidents' | translate }}</dt><dd>{{ route.incidentCount }}</dd></div>
                  <div><dt>{{ 'analyticsBc.detail.serviceScore' | translate }}</dt><dd>{{ route.serviceScore }}%</dd></div>
                </dl>
                <button type="button" (click)="service.setRouteStatus(route.status)">{{ 'analyticsBc.actions.filterSimilar' | translate }}</button>
              </div>
            }
          </article>

          <article class="center-card insight-panel">
            <div class="section-head compact">
              <div>
                <span class="eyebrow">{{ 'analyticsBc.sections.insightEyebrow' | translate }}</span>
                <h2>{{ 'analyticsBc.sections.insightTitle' | translate }}</h2>
              </div>
              <span class="count-pill">{{ service.dashboard().insights.length }} {{ 'analyticsBc.labels.items' | translate }}</span>
            </div>
            <div class="insight-list">
              @for (insight of service.dashboard().insights; track insight.id) {
                <article [ngClass]="insight.impact">
                  <span><mat-icon>psychology_alt</mat-icon></span>
                  <div>
                    <strong>{{ insight.title }}</strong>
                    <p>{{ insight.description }}</p>
                    <small>{{ insight.source }} · {{ insight.action }}</small>
                  </div>
                </article>
              }
            </div>
          </article>
        </aside>
      </section>

      <section class="lower-grid">
        <article class="center-card trends-panel">
          <div class="section-head">
            <div>
              <span class="eyebrow">{{ 'analyticsBc.sections.trendEyebrow' | translate }}</span>
              <h2>{{ 'analyticsBc.sections.trendTitle' | translate }}</h2>
            </div>
            <span class="count-pill">{{ 'analyticsBc.labels.currentWeek' | translate }}</span>
          </div>
          <div class="trend-grid">
            @for (point of service.dashboard().trend; track point.label) {
              <article>
                <strong>{{ point.label }}</strong>
                <div class="stack-bar">
                  <span class="on-time" [style.height.%]="point.onTimeRate"></span>
                  <span class="attendance" [style.height.%]="point.attendanceRate"></span>
                  <span class="delay" [style.height.%]="point.delayMinutes * 4"></span>
                </div>
                <small>{{ point.delayMinutes }} min</small>
              </article>
            }
          </div>
          <div class="legend-row left">
            <span><i class="blue-dot"></i>{{ 'analyticsBc.labels.onTime' | translate }}</span>
            <span><i class="green-dot"></i>{{ 'analyticsBc.labels.attendance' | translate }}</span>
            <span><i class="amber-dot"></i>{{ 'analyticsBc.labels.delay' | translate }}</span>
          </div>
        </article>

        <article class="center-card reports-panel">
          <div class="section-head">
            <div>
              <span class="eyebrow">{{ 'analyticsBc.sections.reportsEyebrow' | translate }}</span>
              <h2>{{ 'analyticsBc.sections.reportsTitle' | translate }}</h2>
            </div>
            <button mat-flat-button type="button" class="primary-action" (click)="service.generateReport()">
              <mat-icon>add_chart</mat-icon>{{ 'analyticsBc.actions.generate' | translate }}
            </button>
          </div>
          <div class="report-filters chip-row">
            @for (option of reportTypeOptions; track option.value) {
              <button type="button" [class.active]="service.reportType() === option.value" (click)="service.setReportType(option.value)">
                <mat-icon>{{ option.icon }}</mat-icon>{{ option.labelKey | translate }}
              </button>
            }
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{{ 'analyticsBc.table.report' | translate }}</th>
                  <th>{{ 'analyticsBc.table.period' | translate }}</th>
                  <th>{{ 'analyticsBc.table.records' | translate }}</th>
                  <th>{{ 'analyticsBc.table.status' | translate }}</th>
                  <th>{{ 'analyticsBc.table.generated' | translate }}</th>
                  <th>{{ 'analyticsBc.table.actions' | translate }}</th>
                </tr>
              </thead>
              <tbody>
                @for (report of service.filteredReports(); track report.id) {
                  <tr>
                    <td><strong>{{ report.title }}</strong><small>{{ report.owner }}</small></td>
                    <td>{{ report.period }}</td>
                    <td>{{ report.records }}</td>
                    <td><span class="status-pill" [ngClass]="report.status">{{ report.status }}</span></td>
                    <td>{{ report.generatedAt | date:'short' }}</td>
                    <td><button mat-icon-button type="button" (click)="service.exportCsv()"><mat-icon>download</mat-icon></button></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </article>

        <aside class="center-card activity-panel">
          <div class="section-head compact">
            <div>
              <span class="eyebrow">{{ 'analyticsBc.sections.activityEyebrow' | translate }}</span>
              <h2>{{ 'analyticsBc.sections.activityTitle' | translate }}</h2>
            </div>
            <span class="count-pill">{{ 'analyticsBc.labels.today' | translate }}</span>
          </div>
          <div class="activity-list">
            @for (activity of service.dashboard().activities; track activity.id) {
              <article [ngClass]="activity.status">
                <span></span>
                <div>
                  <small>{{ activity.time | date:'shortTime' }}</small>
                  <strong>{{ activity.title }}</strong>
                  <p>{{ activity.description }}</p>
                </div>
              </article>
            }
          </div>
        </aside>
      </section>
    </section>
  `,
  styleUrl: './analytics-view.component.css'
})
export class AnalyticsViewComponent {
  protected readonly service = inject(AnalyticsManagementService);

  protected readonly statusOptions: Array<{ value: 'all' | MonitoringStatus; labelKey: string; icon: string }> = [
    { value: 'all', labelKey: 'analyticsBc.filters.allRoutes', icon: 'select_all' },
    { value: 'healthy', labelKey: 'analyticsBc.status.healthy', icon: 'check_circle' },
    { value: 'attention', labelKey: 'analyticsBc.status.attention', icon: 'pending_actions' },
    { value: 'risk', labelKey: 'analyticsBc.status.risk', icon: 'warning' }
  ];

  protected readonly reportTypeOptions: Array<{ value: 'all' | AnalyticsReportType; labelKey: string; icon: string }> = [
    { value: 'all', labelKey: 'analyticsBc.reports.all', icon: 'dashboard' },
    { value: 'fleet', labelKey: 'analyticsBc.reports.fleet', icon: 'directions_bus' },
    { value: 'trip', labelKey: 'analyticsBc.reports.trip', icon: 'route' },
    { value: 'attendance', labelKey: 'analyticsBc.reports.attendance', icon: 'fact_check' },
    { value: 'incident', labelKey: 'analyticsBc.reports.incident', icon: 'report_problem' },
    { value: 'service_quality', labelKey: 'analyticsBc.reports.quality', icon: 'monitoring' }
  ];

  protected readonly routesSortedByRisk = computed(() =>
    [...this.service.dashboard().routes].sort((a, b) => a.serviceScore - b.serviceScore)
  );

  protected statusLabel(status: MonitoringStatus): string {
    return `analyticsBc.status.${status}`;
  }

  protected trendIcon(direction: 'up' | 'down' | 'stable'): string {
    const icons: Record<'up' | 'down' | 'stable', string> = {
      up: 'trending_up',
      down: 'trending_down',
      stable: 'trending_flat'
    };
    return icons[direction];
  }

  protected donutStyle(value: number): string {
    const percentage = Math.max(0, Math.min(100, value));
    return `conic-gradient(#2283c6 0 ${percentage}%, #e5f1f8 ${percentage}% 100%)`;
  }
}
