import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IncidentManagementService } from '../../application/services/incident-management.service';
import { IncidentRecord, IncidentSeverity, IncidentStatus, IncidentType } from '../../domain/models/incident.model';

type IncidentTypeFilter = 'all' | IncidentType;
type IncidentSeverityFilter = 'all' | IncidentSeverity;
type IncidentStatusFilter = 'all' | IncidentStatus;

@Component({
  selector: 'kw-incident-management-page',
  standalone: true,
  imports: [NgClass, DatePipe, TranslateModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <section class="incidents-page">
      <header class="hero-card">
        <div>
          <span class="eyebrow">{{ 'incidents.hero.eyebrow' | translate }}</span>
          <h1>{{ 'incidents.hero.title' | translate }}</h1>
          <p>{{ 'incidents.hero.subtitle' | translate }}</p>
        </div>
        <aside class="hero-badge">
          <span>{{ 'incidents.hero.safetyScore' | translate }}</span>
          <strong>{{ service.summary().safetyScore }}%</strong>
        </aside>
      </header>

      <div class="metric-grid">
        <article class="metric-card">
          <span class="metric-icon blue"><mat-icon>report_problem</mat-icon></span>
          <small>{{ 'incidents.metrics.total' | translate }}</small>
          <strong>{{ service.summary().total }}</strong>
          <p>{{ 'incidents.metrics.totalHint' | translate }}</p>
        </article>
        <article class="metric-card">
          <span class="metric-icon amber"><mat-icon>pending_actions</mat-icon></span>
          <small>{{ 'incidents.metrics.open' | translate }}</small>
          <strong>{{ service.summary().open }}</strong>
          <p>{{ 'incidents.metrics.openHint' | translate }}</p>
        </article>
        <article class="metric-card">
          <span class="metric-icon red"><mat-icon>priority_high</mat-icon></span>
          <small>{{ 'incidents.metrics.critical' | translate }}</small>
          <strong>{{ service.summary().critical }}</strong>
          <p>{{ 'incidents.metrics.criticalHint' | translate }}</p>
        </article>
        <article class="metric-card">
          <span class="metric-icon violet"><mat-icon>upgrade</mat-icon></span>
          <small>{{ 'incidents.metrics.escalated' | translate }}</small>
          <strong>{{ service.summary().escalated }}</strong>
          <p>{{ 'incidents.metrics.escalatedHint' | translate }}</p>
        </article>
        <article class="metric-card">
          <span class="metric-icon green"><mat-icon>task_alt</mat-icon></span>
          <small>{{ 'incidents.metrics.resolved' | translate }}</small>
          <strong>{{ service.summary().resolved }}</strong>
          <p>{{ 'incidents.metrics.resolvedHint' | translate }}</p>
        </article>
      </div>

      <div class="command-banner">
        <span><mat-icon>health_and_safety</mat-icon></span>
        <div>
          <strong>{{ 'incidents.banner.title' | translate }}</strong>
          <p>{{ 'incidents.banner.message' | translate }}</p>
        </div>
        <button type="button" (click)="statusFilter.set('escalated')">{{ 'incidents.actions.reviewCritical' | translate }}</button>
      </div>

      @if (showForm()) {
        <section class="center-card report-card">
          <div class="section-head">
            <div>
              <span class="eyebrow">{{ 'incidents.sections.formEyebrow' | translate }}</span>
              <h2>{{ 'incidents.sections.formTitle' | translate }}</h2>
            </div>
            <button type="button" class="icon-action" (click)="showForm.set(false)"><mat-icon>close</mat-icon></button>
          </div>

          <div class="form-grid">
            <label>
              <span>{{ 'incidents.form.title' | translate }}</span>
              <input [value]="draft().title" (input)="patchDraft('title', $any($event.target).value)">
            </label>
            <label>
              <span>{{ 'incidents.form.type' | translate }}</span>
              <select [value]="draft().type" (change)="patchDraft('type', $any($event.target).value)">
                @for (option of typeOptionsWithoutAll; track option.value) {
                  <option [value]="option.value">{{ option.labelKey | translate }}</option>
                }
              </select>
            </label>
            <label>
              <span>{{ 'incidents.form.severity' | translate }}</span>
              <select [value]="draft().severity" (change)="patchDraft('severity', $any($event.target).value)">
                @for (option of severityOptionsWithoutAll; track option.value) {
                  <option [value]="option.value">{{ option.labelKey | translate }}</option>
                }
              </select>
            </label>
            <label>
              <span>{{ 'incidents.form.vehicle' | translate }}</span>
              <input [value]="draft().vehiclePlate" (input)="patchDraft('vehiclePlate', $any($event.target).value)">
            </label>
            <label>
              <span>{{ 'incidents.form.route' | translate }}</span>
              <input [value]="draft().routeName" (input)="patchDraft('routeName', $any($event.target).value)">
            </label>
            <label>
              <span>{{ 'incidents.form.driver' | translate }}</span>
              <input [value]="draft().driverName" (input)="patchDraft('driverName', $any($event.target).value)">
            </label>
            <label class="wide">
              <span>{{ 'incidents.form.description' | translate }}</span>
              <textarea rows="3" [value]="draft().description" (input)="patchDraft('description', $any($event.target).value)"></textarea>
            </label>
          </div>

          <div class="form-actions">
            <button type="button" class="ghost" (click)="showForm.set(false)">{{ 'actions.cancel' | translate }}</button>
            <button type="button" class="primary-action" (click)="createIncident()"><mat-icon>add_alert</mat-icon>{{ 'incidents.actions.saveReport' | translate }}</button>
          </div>
        </section>
      }

      <section class="main-grid">
        <article class="center-card stream-card">
          <div class="section-head">
            <div>
              <span class="eyebrow">{{ 'incidents.sections.rosterEyebrow' | translate }}</span>
              <h2>{{ 'incidents.sections.rosterTitle' | translate }}</h2>
            </div>
            <button mat-flat-button type="button" class="primary-action" (click)="showReportForm()">
              <mat-icon>add_alert</mat-icon>
              {{ 'incidents.actions.report' | translate }}
            </button>
          </div>

          <div class="filters-row">
            <label class="search-control">
              <mat-icon>search</mat-icon>
              <input type="search" [placeholder]="'incidents.filters.search' | translate" [value]="query()" (input)="query.set($any($event.target).value)">
            </label>
            <div class="chip-row">
              @for (option of typeOptions; track option.value) {
                <button type="button" [class.active]="typeFilter() === option.value" (click)="setType(option.value)">
                  <mat-icon>{{ option.icon }}</mat-icon>{{ option.labelKey | translate }}
                </button>
              }
            </div>
          </div>

          <div class="filters-row secondary">
            <div class="chip-row">
              @for (option of severityOptions; track option.value) {
                <button type="button" [class.active]="severityFilter() === option.value" (click)="setSeverity(option.value)">{{ option.labelKey | translate }}</button>
              }
            </div>
            <div class="chip-row">
              @for (option of statusOptions; track option.value) {
                <button type="button" [class.active]="statusFilter() === option.value" (click)="setStatus(option.value)">{{ option.labelKey | translate }}</button>
              }
            </div>
          </div>

          <div class="incident-list">
            @for (incident of filteredIncidents(); track incident.id) {
              <article class="incident-card" [class.selected]="selected()?.id === incident.id" [ngClass]="[incident.severity, incident.status]" (click)="select(incident)">
                <span class="incident-icon" [ngClass]="incident.severity"><mat-icon>{{ service.iconForType(incident.type) }}</mat-icon></span>
                <div class="incident-body">
                  <div class="incident-topline">
                    <div>
                      <strong>{{ incident.title }}</strong>
                      <p>{{ incident.description }}</p>
                    </div>
                    <span class="severity-pill" [ngClass]="incident.severity">{{ severityLabel(incident.severity) | translate }}</span>
                  </div>
                  <div class="meta-row">
                    <span><mat-icon>confirmation_number</mat-icon>{{ incident.code }}</span>
                    <span><mat-icon>directions_bus</mat-icon>{{ incident.vehiclePlate }}</span>
                    <span><mat-icon>alt_route</mat-icon>{{ incident.routeName }}</span>
                    <span><mat-icon>person</mat-icon>{{ incident.driverName }}</span>
                    <span><mat-icon>schedule</mat-icon>{{ incident.reportedAt | date:'shortTime' }}</span>
                  </div>
                  <div class="progress-row">
                    <span>{{ 'incidents.labels.responseTime' | translate }}</span>
                    <strong>{{ incident.responseTimeMinutes }} min</strong>
                  </div>
                </div>
                <div class="row-actions">
                  <button mat-icon-button type="button" [matTooltip]="'incidents.actions.review' | translate" (click)="select(incident); $event.stopPropagation()"><mat-icon>visibility</mat-icon></button>
                  <button mat-icon-button type="button" [matTooltip]="'incidents.actions.escalate' | translate" (click)="escalate(incident, $event)"><mat-icon>upgrade</mat-icon></button>
                  <button mat-icon-button type="button" [matTooltip]="'incidents.actions.resolve' | translate" (click)="resolve(incident, $event)"><mat-icon>task_alt</mat-icon></button>
                  <button mat-icon-button type="button" class="danger-button" [matTooltip]="'incidents.actions.remove' | translate" (click)="remove(incident, $event)"><mat-icon>delete</mat-icon></button>
                </div>
              </article>
            } @empty {
              <div class="empty-state">
                <mat-icon>report_off</mat-icon>
                <strong>{{ 'incidents.empty.title' | translate }}</strong>
                <p>{{ 'incidents.empty.message' | translate }}</p>
              </div>
            }
          </div>
        </article>

        <aside class="side-stack">
          <article class="center-card detail-panel">
            <div class="section-head compact">
              <div>
                <span class="eyebrow">{{ 'incidents.sections.detailEyebrow' | translate }}</span>
                <h2>{{ 'incidents.sections.detailTitle' | translate }}</h2>
              </div>
              @if (selected(); as incident) {
                <span class="status-pill" [ngClass]="incident.status">{{ statusLabel(incident.status) | translate }}</span>
              }
            </div>

            @if (selected(); as incident) {
              <div class="selected-card" [ngClass]="incident.severity">
                <span class="incident-icon large" [ngClass]="incident.severity"><mat-icon>{{ service.iconForType(incident.type) }}</mat-icon></span>
                <h3>{{ incident.title }}</h3>
                <p>{{ incident.description }}</p>
                <dl>
                  <div><dt>{{ 'incidents.detail.code' | translate }}</dt><dd>{{ incident.code }}</dd></div>
                  <div><dt>{{ 'incidents.detail.status' | translate }}</dt><dd>{{ statusLabel(incident.status) | translate }}</dd></div>
                  <div><dt>{{ 'incidents.detail.severity' | translate }}</dt><dd>{{ severityLabel(incident.severity) | translate }}</dd></div>
                  <div><dt>{{ 'incidents.detail.vehicle' | translate }}</dt><dd>{{ incident.vehiclePlate }}</dd></div>
                  <div><dt>{{ 'incidents.detail.route' | translate }}</dt><dd>{{ incident.routeName }}</dd></div>
                  <div><dt>{{ 'incidents.detail.driver' | translate }}</dt><dd>{{ incident.driverName }}</dd></div>
                  <div><dt>{{ 'incidents.detail.evidence' | translate }}</dt><dd>{{ incident.evidenceCount }}</dd></div>
                  <div><dt>{{ 'incidents.detail.reportedBy' | translate }}</dt><dd>{{ incident.reportedBy }}</dd></div>
                </dl>
                @if (incident.resolution) {
                  <div class="resolution-box">
                    <strong>{{ 'incidents.detail.resolution' | translate }}</strong>
                    <p>{{ incident.resolution }}</p>
                  </div>
                }
                <div class="detail-actions">
                  <button type="button" (click)="service.updateStatus(incident.id, 'in_review')">{{ 'incidents.actions.startReview' | translate }}</button>
                  <button type="button" class="ghost" (click)="service.updateStatus(incident.id, 'resolved')">{{ 'incidents.actions.resolve' | translate }}</button>
                </div>
              </div>
            }
          </article>

          <article class="center-card review-panel">
            <div class="section-head compact">
              <div>
                <span class="eyebrow">{{ 'incidents.sections.reviewEyebrow' | translate }}</span>
                <h2>{{ 'incidents.sections.reviewTitle' | translate }}</h2>
              </div>
              <span class="count-pill">{{ service.reviews().length }} {{ 'incidents.labels.items' | translate }}</span>
            </div>
            <div class="review-list">
              @for (review of service.reviews(); track review.id) {
                <article class="review-card" [ngClass]="review.severity">
                  <span><mat-icon>priority_high</mat-icon></span>
                  <div>
                    <strong>{{ review.title }}</strong>
                    <p>{{ review.description }}</p>
                    <small>{{ review.incidentCode }} · {{ review.dueDate }}</small>
                  </div>
                  <em>{{ severityLabel(review.severity) | translate }}</em>
                </article>
              }
            </div>
          </article>

          <article class="center-card timeline-panel">
            <div class="section-head compact">
              <div>
                <span class="eyebrow">{{ 'incidents.sections.timelineEyebrow' | translate }}</span>
                <h2>{{ 'incidents.sections.timelineTitle' | translate }}</h2>
              </div>
              <span class="count-pill">{{ 'incidents.sections.today' | translate }}</span>
            </div>
            <div class="activity-list">
              @for (activity of service.activities(); track activity.id) {
                <div class="activity-item" [ngClass]="activity.status">
                  <span></span>
                  <div>
                    <strong>{{ activity.time }} · {{ activity.title }}</strong>
                    <p>{{ activity.description }}</p>
                  </div>
                </div>
              }
            </div>
          </article>
        </aside>
      </section>

      <section class="center-card registry-card">
        <div class="section-head">
          <div>
            <span class="eyebrow">{{ 'incidents.sections.registryEyebrow' | translate }}</span>
            <h2>{{ 'incidents.sections.registryTitle' | translate }}</h2>
          </div>
          <button type="button" class="export-button" (click)="exportCsv()"><mat-icon>download</mat-icon>{{ 'incidents.actions.export' | translate }}</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{{ 'incidents.table.incident' | translate }}</th>
                <th>{{ 'incidents.table.vehicle' | translate }}</th>
                <th>{{ 'incidents.table.route' | translate }}</th>
                <th>{{ 'incidents.table.severity' | translate }}</th>
                <th>{{ 'incidents.table.status' | translate }}</th>
                <th>{{ 'incidents.table.response' | translate }}</th>
                <th>{{ 'incidents.table.actions' | translate }}</th>
              </tr>
            </thead>
            <tbody>
              @for (incident of filteredIncidents(); track incident.id) {
                <tr>
                  <td><strong>{{ incident.title }}</strong><small>{{ incident.code }} · {{ incident.district }}</small></td>
                  <td>{{ incident.vehiclePlate }}</td>
                  <td>{{ incident.routeName }}</td>
                  <td><span class="severity-pill" [ngClass]="incident.severity">{{ severityLabel(incident.severity) | translate }}</span></td>
                  <td><span class="status-pill" [ngClass]="incident.status">{{ statusLabel(incident.status) | translate }}</span></td>
                  <td>{{ incident.responseTimeMinutes }} min</td>
                  <td>
                    <button mat-icon-button type="button" (click)="select(incident)"><mat-icon>visibility</mat-icon></button>
                    <button mat-icon-button type="button" (click)="resolve(incident, $event)"><mat-icon>task_alt</mat-icon></button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    </section>
  `,
  styles: [`
    .incidents-page { display: grid; gap: 22px; }
    .hero-card { min-height: 150px; border: 1px solid rgba(34, 131, 198, .12); border-radius: 28px; padding: 28px 32px; display: flex; justify-content: space-between; align-items: center; background: radial-gradient(circle at 64% 12%, rgba(52, 211, 203, .16), transparent 30%), linear-gradient(110deg, rgba(255,255,255,.96), rgba(235,248,255,.92) 50%, rgba(255,244,216,.9)); box-shadow: var(--kw-shadow); }
    .eyebrow { display: inline-block; color: var(--kw-blue-700); font-size: .78rem; font-weight: 900; letter-spacing: .16em; text-transform: uppercase; }
    h1, h2, h3, p { margin: 0; }
    h1 { margin-top: 8px; font-size: clamp(2.1rem, 4vw, 4.1rem); line-height: .95; letter-spacing: -.07em; color: var(--kw-ink); }
    .hero-card p { max-width: 720px; margin-top: 14px; color: var(--kw-muted); font-size: 1rem; }
    .hero-badge { min-width: 126px; padding: 18px 20px; border-radius: 18px; text-align: center; background: rgba(255,255,255,.92); box-shadow: 0 18px 38px rgba(15,43,87,.10); }
    .hero-badge span { display: block; color: #64748b; font-size: .78rem; font-weight: 800; }
    .hero-badge strong { display: block; margin-top: 4px; font-size: 2rem; color: var(--kw-blue-700); }
    .metric-grid { display: grid; grid-template-columns: repeat(5, minmax(160px, 1fr)); gap: 18px; }
    .metric-card { position: relative; min-height: 124px; overflow: hidden; padding: 18px; border: 1px solid var(--kw-border); border-radius: 22px; background: var(--kw-card); box-shadow: 0 14px 35px rgba(15,43,87,.08); }
    .metric-card::after { content: ''; position: absolute; right: -18px; bottom: -24px; width: 78px; height: 78px; border-radius: 999px; background: rgba(34, 131, 198, .12); }
    .metric-icon { width: 34px; height: 34px; border-radius: 12px; display: grid; place-items: center; margin-bottom: 10px; }
    .metric-icon mat-icon { font-size: 19px; width: 19px; height: 19px; }
    .metric-icon.blue { color: var(--kw-blue-700); background: #e0f2fe; }
    .metric-icon.red { color: #ef4444; background: #fee2e2; }
    .metric-icon.amber { color: #d97706; background: #fef3c7; }
    .metric-icon.green { color: #10b981; background: #dcfce7; }
    .metric-icon.violet { color: #7c3aed; background: #ede9fe; }
    .metric-card small { color: #64748b; font-weight: 800; }
    .metric-card strong { display: block; margin-top: 4px; font-size: 1.9rem; line-height: 1; }
    .metric-card p { margin-top: 8px; color: var(--kw-muted); font-size: .84rem; }
    .command-banner { display: flex; align-items: center; gap: 16px; padding: 16px 18px; border: 1px solid rgba(245, 158, 11, .32); border-radius: 20px; background: linear-gradient(90deg, rgba(255, 251, 235, .96), rgba(255, 255, 255, .82)); }
    .command-banner > span { width: 42px; height: 42px; border-radius: 15px; display: grid; place-items: center; color: #d97706; background: #fef3c7; }
    .command-banner strong { display: block; color: #92400e; }
    .command-banner p { color: #64748b; }
    .command-banner button { margin-left: auto; border: 0; border-radius: 14px; padding: 11px 16px; color: #075985; background: #e0f2fe; font-weight: 900; cursor: pointer; }
    .center-card { border: 1px solid var(--kw-border); border-radius: 24px; background: var(--kw-card); box-shadow: var(--kw-shadow); }
    .report-card, .stream-card, .registry-card { padding: 20px; }
    .main-grid { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 22px; align-items: start; }
    .side-stack { display: grid; gap: 18px; }
    .section-head { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-bottom: 16px; }
    .section-head h2 { font-size: 1.7rem; letter-spacing: -.04em; }
    .section-head.compact h2 { font-size: 1.35rem; }
    .primary-action { border: 0; border-radius: 14px !important; background: var(--kw-blue-700) !important; color: #fff !important; font-weight: 900 !important; padding: 10px 16px; display: inline-flex; gap: 8px; align-items: center; cursor: pointer; }
    .icon-action { border: 0; border-radius: 999px; width: 38px; height: 38px; display: grid; place-items: center; background: #e0f2fe; color: var(--kw-blue-700); cursor: pointer; }
    .filters-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .filters-row.secondary { justify-content: space-between; flex-wrap: wrap; }
    .search-control { flex: 1; min-width: 260px; height: 44px; display: flex; align-items: center; gap: 10px; padding: 0 14px; border: 1px solid var(--kw-border); border-radius: 16px; background: #fff; }
    .search-control mat-icon { color: var(--kw-blue-700); }
    .search-control input { width: 100%; border: 0; outline: 0; background: transparent; }
    .chip-row { display: flex; gap: 8px; flex-wrap: wrap; }
    .chip-row button { min-height: 38px; border: 1px solid var(--kw-border); border-radius: 999px; display: inline-flex; align-items: center; gap: 7px; padding: 0 14px; color: #334155; background: #fff; font-weight: 900; cursor: pointer; }
    .chip-row button mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .chip-row button.active { color: #fff; background: var(--kw-blue-700); box-shadow: 0 12px 22px rgba(34, 131, 198, .22); }
    .incident-list { display: grid; gap: 12px; margin-top: 16px; }
    .incident-card { display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: center; padding: 16px; border: 1px solid var(--kw-border); border-left: 5px solid var(--kw-blue-700); border-radius: 18px; background: rgba(255,255,255,.92); cursor: pointer; transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
    .incident-card:hover, .incident-card.selected { transform: translateY(-1px); box-shadow: 0 16px 30px rgba(15,43,87,.08); border-color: rgba(34, 131, 198, .34); }
    .incident-card.critical { border-left-color: #ef4444; }
    .incident-card.high { border-left-color: #f59e0b; }
    .incident-card.medium { border-left-color: var(--kw-blue-700); }
    .incident-card.low { border-left-color: #10b981; }
    .incident-card.resolved, .incident-card.closed { opacity: .82; }
    .incident-icon { width: 44px; height: 44px; border-radius: 15px; display: grid; place-items: center; background: #e0f2fe; color: var(--kw-blue-700); }
    .incident-icon.large { width: 54px; height: 54px; }
    .incident-icon.critical { color: #ef4444; background: #fee2e2; }
    .incident-icon.high { color: #d97706; background: #fef3c7; }
    .incident-icon.low { color: #10b981; background: #dcfce7; }
    .incident-topline { display: flex; justify-content: space-between; gap: 12px; }
    .incident-topline strong { color: #0f172a; font-size: 1rem; }
    .incident-body p { margin-top: 4px; color: #64748b; }
    .meta-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-top: 10px; color: #475569; font-size: .83rem; font-weight: 800; }
    .meta-row span { display: inline-flex; align-items: center; gap: 4px; }
    .meta-row mat-icon { font-size: 16px; width: 16px; height: 16px; color: #64748b; }
    .progress-row { margin-top: 12px; height: 32px; border-radius: 12px; padding: 0 12px; background: #f1f5f9; display: flex; align-items: center; justify-content: space-between; color: #64748b; font-weight: 900; }
    .row-actions { display: flex; gap: 6px; }
    .row-actions button, td button { background: #e0f2fe; color: var(--kw-blue-700); }
    .row-actions .danger-button { background: #fee2e2; color: #ef4444; }
    .severity-pill, .status-pill, .count-pill { border-radius: 999px; padding: 7px 11px; font-size: .78rem; font-weight: 900; white-space: nowrap; }
    .severity-pill.critical { color: #dc2626; background: #fee2e2; }
    .severity-pill.high { color: #b45309; background: #fef3c7; }
    .severity-pill.medium { color: #075985; background: #e0f2fe; }
    .severity-pill.low { color: #047857; background: #dcfce7; }
    .status-pill.reported { color: #b45309; background: #fef3c7; }
    .status-pill.in_review { color: #075985; background: #e0f2fe; }
    .status-pill.escalated { color: #7c2d12; background: #ffedd5; }
    .status-pill.resolved, .status-pill.closed { color: #047857; background: #dcfce7; }
    .count-pill { color: #075985; background: #e0f2fe; }
    .detail-panel, .review-panel, .timeline-panel { padding: 18px; }
    .selected-card { border-radius: 18px; padding: 18px; background: #f8fafc; }
    .selected-card h3 { margin-top: 12px; font-size: 1rem; }
    .selected-card p { margin-top: 8px; color: #64748b; }
    dl { display: grid; gap: 10px; margin: 16px 0 0; }
    dl div { display: flex; align-items: center; justify-content: space-between; gap: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
    dt { color: #64748b; font-weight: 900; }
    dd { margin: 0; color: #0f172a; font-weight: 900; text-align: right; }
    .resolution-box { margin-top: 14px; padding: 12px; border-radius: 14px; background: #ecfdf5; color: #047857; }
    .detail-actions, .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }
    .detail-actions button, .form-actions button, .export-button { border: 0; border-radius: 14px; padding: 10px 14px; background: var(--kw-blue-700); color: #fff; font-weight: 900; cursor: pointer; }
    .detail-actions .ghost, .form-actions .ghost { color: #075985; background: #e0f2fe; }
    .review-list, .activity-list { display: grid; gap: 12px; }
    .review-card { display: grid; grid-template-columns: auto 1fr auto; gap: 12px; padding: 14px; border: 1px solid var(--kw-border); border-left: 4px solid #f59e0b; border-radius: 16px; background: #fff; }
    .review-card.critical { border-left-color: #ef4444; }
    .review-card.low { border-left-color: #10b981; }
    .review-card > span { width: 34px; height: 34px; border-radius: 13px; display: grid; place-items: center; color: #ef4444; background: #fee2e2; }
    .review-card strong { display: block; }
    .review-card p { margin-top: 4px; color: #64748b; }
    .review-card small { display: block; margin-top: 8px; color: var(--kw-blue-700); font-weight: 900; }
    .review-card em { align-self: start; border-radius: 999px; background: #fef3c7; padding: 6px 10px; font-style: normal; font-weight: 900; color: #b45309; }
    .activity-item { display: grid; grid-template-columns: auto 1fr; gap: 12px; padding: 12px; border: 1px solid var(--kw-border); border-radius: 16px; background: #fff; }
    .activity-item > span { width: 10px; height: 10px; border-radius: 999px; background: var(--kw-blue-700); margin-top: 5px; }
    .activity-item.completed > span { background: #10b981; }
    .activity-item.pending > span { background: #f59e0b; }
    .activity-item p { margin-top: 4px; color: #64748b; }
    .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    .form-grid label { display: grid; gap: 7px; color: #64748b; font-weight: 900; }
    .form-grid label.wide { grid-column: 1 / -1; }
    .form-grid input, .form-grid select, .form-grid textarea { border: 1px solid var(--kw-border); border-radius: 14px; padding: 11px 12px; outline: 0; background: #fff; color: #0f172a; font: inherit; }
    .form-grid input:focus, .form-grid select:focus, .form-grid textarea:focus { border-color: var(--kw-blue-700); box-shadow: 0 0 0 3px rgba(34, 131, 198, .12); }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; min-width: 900px; }
    th { text-align: left; padding: 14px 12px; background: #f1f5f9; color: #64748b; font-size: .78rem; letter-spacing: .08em; text-transform: uppercase; }
    td { padding: 14px 12px; border-bottom: 1px solid #e2e8f0; color: #334155; font-weight: 700; }
    td small { display: block; margin-top: 4px; color: #64748b; }
    .empty-state { min-height: 220px; display: grid; place-items: center; text-align: center; color: #64748b; }
    .empty-state mat-icon { font-size: 42px; width: 42px; height: 42px; color: var(--kw-blue-700); }
    @media (max-width: 1180px) { .metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .main-grid { grid-template-columns: 1fr; } .form-grid { grid-template-columns: 1fr; } }
    @media (max-width: 740px) { .hero-card, .command-banner, .filters-row, .incident-card { display: flex; flex-direction: column; align-items: stretch; } .metric-grid { grid-template-columns: 1fr; } .row-actions { justify-content: flex-end; } }
  `]
})
export class IncidentViewComponent implements OnInit {
  protected readonly service = inject(IncidentManagementService);

  protected readonly query = signal('');
  protected readonly typeFilter = signal<IncidentTypeFilter>('all');
  protected readonly severityFilter = signal<IncidentSeverityFilter>('all');
  protected readonly statusFilter = signal<IncidentStatusFilter>('all');
  protected readonly selected = signal<IncidentRecord | null>(null);
  protected readonly showForm = signal(false);
  protected readonly draft = signal<Partial<IncidentRecord>>({
    title: '',
    description: '',
    type: 'delay',
    severity: 'medium',
    vehiclePlate: 'KW-204',
    routeName: 'Miraflores School Route',
    driverName: 'Carlos Pérez'
  });

  protected readonly typeOptions: { value: IncidentTypeFilter; labelKey: string; icon: string }[] = [
    { value: 'all', labelKey: 'incidents.types.all', icon: 'apps' },
    { value: 'delay', labelKey: 'incidents.types.delay', icon: 'schedule' },
    { value: 'route_deviation', labelKey: 'incidents.types.routeDeviation', icon: 'alt_route' },
    { value: 'mechanical', labelKey: 'incidents.types.mechanical', icon: 'build' },
    { value: 'medical', labelKey: 'incidents.types.medical', icon: 'medical_services' },
    { value: 'safety', labelKey: 'incidents.types.safety', icon: 'health_and_safety' }
  ];

  protected readonly typeOptionsWithoutAll = this.typeOptions.filter((option): option is { value: IncidentType; labelKey: string; icon: string } => option.value !== 'all');

  protected readonly severityOptions: { value: IncidentSeverityFilter; labelKey: string }[] = [
    { value: 'all', labelKey: 'incidents.severity.all' },
    { value: 'critical', labelKey: 'incidents.severity.critical' },
    { value: 'high', labelKey: 'incidents.severity.high' },
    { value: 'medium', labelKey: 'incidents.severity.medium' },
    { value: 'low', labelKey: 'incidents.severity.low' }
  ];

  protected readonly severityOptionsWithoutAll = this.severityOptions.filter((option): option is { value: IncidentSeverity; labelKey: string } => option.value !== 'all');

  protected readonly statusOptions: { value: IncidentStatusFilter; labelKey: string }[] = [
    { value: 'all', labelKey: 'incidents.status.all' },
    { value: 'reported', labelKey: 'incidents.status.reported' },
    { value: 'in_review', labelKey: 'incidents.status.inReview' },
    { value: 'escalated', labelKey: 'incidents.status.escalated' },
    { value: 'resolved', labelKey: 'incidents.status.resolved' },
    { value: 'closed', labelKey: 'incidents.status.closed' }
  ];

  protected readonly filteredIncidents = computed(() => {
    const term = this.query().trim().toLowerCase();
    return this.service.incidents().filter((incident) => {
      const matchesType = this.typeFilter() === 'all' || incident.type === this.typeFilter();
      const matchesSeverity = this.severityFilter() === 'all' || incident.severity === this.severityFilter();
      const matchesStatus = this.statusFilter() === 'all' || incident.status === this.statusFilter();
      const haystack = [
        incident.title,
        incident.description,
        incident.code,
        incident.routeName,
        incident.vehiclePlate,
        incident.driverName,
        incident.schoolName,
        incident.district,
        incident.studentName ?? ''
      ].join(' ').toLowerCase();
      return matchesType && matchesSeverity && matchesStatus && (!term || haystack.includes(term));
    });
  });

  ngOnInit(): void {
    this.service.load();
    queueMicrotask(() => this.selected.set(this.filteredIncidents()[0] ?? null));
  }

  protected setType(type: IncidentTypeFilter): void {
    this.typeFilter.set(type);
    this.selectFirstFiltered();
  }

  protected setSeverity(severity: IncidentSeverityFilter): void {
    this.severityFilter.set(severity);
    this.selectFirstFiltered();
  }

  protected setStatus(status: IncidentStatusFilter): void {
    this.statusFilter.set(status);
    this.selectFirstFiltered();
  }

  protected select(incident: IncidentRecord): void {
    this.selected.set(incident);
  }

  protected showReportForm(): void {
    this.showForm.set(true);
  }

  protected patchDraft<K extends keyof IncidentRecord>(key: K, value: IncidentRecord[K]): void {
    this.draft.update((draft) => ({ ...draft, [key]: value }));
  }

  protected createIncident(): void {
    const incident = this.service.createIncident(this.draft());
    this.selected.set(incident);
    this.showForm.set(false);
    this.draft.set({
      title: '',
      description: '',
      type: 'delay',
      severity: 'medium',
      vehiclePlate: 'KW-204',
      routeName: 'Miraflores School Route',
      driverName: 'Carlos Pérez'
    });
  }

  protected escalate(incident: IncidentRecord, event: Event): void {
    event.stopPropagation();
    this.service.updateStatus(incident.id, 'escalated');
    this.service.updateSeverity(incident.id, incident.severity === 'critical' ? 'critical' : 'high');
    this.selected.set({ ...incident, status: 'escalated', severity: incident.severity === 'critical' ? 'critical' : 'high' });
  }

  protected resolve(incident: IncidentRecord, event: Event): void {
    event.stopPropagation();
    this.service.updateStatus(incident.id, 'resolved');
    this.selected.set({ ...incident, status: 'resolved', resolution: incident.resolution ?? 'Operational follow-up completed.' });
  }

  protected remove(incident: IncidentRecord, event: Event): void {
    event.stopPropagation();
    this.service.removeIncident(incident.id);
    this.selected.set(this.filteredIncidents()[0] ?? null);
  }

  protected severityLabel(severity: IncidentSeverity): string {
    return `incidents.severity.${severity === 'high' ? 'high' : severity === 'medium' ? 'medium' : severity === 'low' ? 'low' : 'critical'}`;
  }

  protected statusLabel(status: IncidentStatus): string {
    const labels: Record<IncidentStatus, string> = {
      reported: 'incidents.status.reported',
      in_review: 'incidents.status.inReview',
      escalated: 'incidents.status.escalated',
      resolved: 'incidents.status.resolved',
      closed: 'incidents.status.closed'
    };
    return labels[status];
  }

  protected exportCsv(): void {
    const header = ['code', 'title', 'vehicle', 'route', 'severity', 'status', 'responseMinutes'];
    const rows = this.filteredIncidents().map((incident) => [
      incident.code,
      incident.title,
      incident.vehiclePlate,
      incident.routeName,
      incident.severity,
      incident.status,
      String(incident.responseTimeMinutes)
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'kidway-incident-management.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private selectFirstFiltered(): void {
    queueMicrotask(() => this.selected.set(this.filteredIncidents()[0] ?? null));
  }
}
