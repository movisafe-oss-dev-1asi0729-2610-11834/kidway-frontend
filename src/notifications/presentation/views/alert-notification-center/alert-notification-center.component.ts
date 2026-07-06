import { Component, computed, effect, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationService } from '../../../application/services/notification.service';
import { NotificationCategory, NotificationItem, NotificationPriority, NotificationStatus } from '../../../domain/models/notification.model';

@Component({
  selector: 'kw-alert-notification-center',
  standalone: true,
  imports: [NgClass, TranslateModule, MatIconModule, MatButtonModule, MatTooltipModule],
  template: `
    <section class="notifications-page">
      <header class="hero-card">
        <div>
          <span class="eyebrow">{{ 'alertsCenter.hero.eyebrow' | translate }}</span>
          <h1>{{ 'alertsCenter.hero.title' | translate }}</h1>
          <p>{{ 'alertsCenter.hero.subtitle' | translate }}</p>
        </div>
        <aside class="hero-badge">
          <span>{{ 'alertsCenter.hero.unread' | translate }}</span>
          <strong>{{ summary().unread }}</strong>
        </aside>
      </header>

      <div class="metric-grid">
        <article class="metric-card">
          <span class="metric-icon blue"><mat-icon>campaign</mat-icon></span>
          <small>{{ 'alertsCenter.metrics.total' | translate }}</small>
          <strong>{{ summary().total }}</strong>
          <p>{{ 'alertsCenter.metrics.totalHint' | translate }}</p>
        </article>
        <article class="metric-card">
          <span class="metric-icon red"><mat-icon>priority_high</mat-icon></span>
          <small>{{ 'alertsCenter.metrics.critical' | translate }}</small>
          <strong>{{ summary().criticalAlerts }}</strong>
          <p>{{ 'alertsCenter.metrics.criticalHint' | translate }}</p>
        </article>
        <article class="metric-card">
          <span class="metric-icon amber"><mat-icon>mark_email_unread</mat-icon></span>
          <small>{{ 'alertsCenter.metrics.unread' | translate }}</small>
          <strong>{{ summary().unread }}</strong>
          <p>{{ 'alertsCenter.metrics.unreadHint' | translate }}</p>
        </article>
        <article class="metric-card">
          <span class="metric-icon green"><mat-icon>verified</mat-icon></span>
          <small>{{ 'alertsCenter.metrics.delivery' | translate }}</small>
          <strong>{{ summary().deliveryRate }}%</strong>
          <p>{{ 'alertsCenter.metrics.deliveryHint' | translate }}</p>
        </article>
        <article class="metric-card">
          <span class="metric-icon teal"><mat-icon>task_alt</mat-icon></span>
          <small>{{ 'alertsCenter.metrics.acknowledged' | translate }}</small>
          <strong>{{ summary().acknowledged }}</strong>
          <p>{{ 'alertsCenter.metrics.acknowledgedHint' | translate }}</p>
        </article>
      </div>

      <div class="command-banner">
        <span><mat-icon>notification_important</mat-icon></span>
        <div>
          <strong>{{ 'alertsCenter.banner.title' | translate }}</strong>
          <p>{{ 'alertsCenter.banner.message' | translate }}</p>
        </div>
        <button type="button" (click)="notificationService.markAllAsRead()">{{ 'alertsCenter.actions.markAll' | translate }}</button>
      </div>

      <section class="main-grid">
        <article class="center-card stream-card">
          <div class="section-head">
            <div>
              <span class="eyebrow">{{ 'alertsCenter.sections.inboxEyebrow' | translate }}</span>
              <h2>{{ 'alertsCenter.sections.inboxTitle' | translate }}</h2>
            </div>
            <button mat-flat-button type="button" class="primary-action" (click)="exportCurrent()">
              <mat-icon>download</mat-icon>
              {{ 'alertsCenter.actions.export' | translate }}
            </button>
          </div>

          <div class="filters-row">
            <label class="search-control">
              <mat-icon>search</mat-icon>
              <input type="search" [placeholder]="'alertsCenter.filters.search' | translate" [value]="query()" (input)="query.set($any($event.target).value)">
            </label>
            <div class="chip-row">
              <button type="button" [class.active]="category() === 'all'" (click)="setCategory('all')"><mat-icon>inbox</mat-icon>{{ 'alertsCenter.filters.all' | translate }}</button>
              <button type="button" [class.active]="category() === 'alert'" (click)="setCategory('alert')"><mat-icon>campaign</mat-icon>{{ 'alertsCenter.filters.alerts' | translate }}</button>
              <button type="button" [class.active]="category() === 'notification'" (click)="setCategory('notification')"><mat-icon>notifications</mat-icon>{{ 'alertsCenter.filters.notifications' | translate }}</button>
            </div>
          </div>

          <div class="filters-row secondary">
            <div class="chip-row">
              <button type="button" [class.active]="priority() === 'all'" (click)="setPriority('all')">{{ 'alertsCenter.filters.allPriority' | translate }}</button>
              <button type="button" [class.active]="priority() === 'critical'" (click)="setPriority('critical')">{{ 'alertsCenter.priority.critical' | translate }}</button>
              <button type="button" [class.active]="priority() === 'high'" (click)="setPriority('high')">{{ 'alertsCenter.priority.high' | translate }}</button>
              <button type="button" [class.active]="priority() === 'medium'" (click)="setPriority('medium')">{{ 'alertsCenter.priority.medium' | translate }}</button>
              <button type="button" [class.active]="priority() === 'low'" (click)="setPriority('low')">{{ 'alertsCenter.priority.low' | translate }}</button>
            </div>
            <div class="chip-row">
              <button type="button" [class.active]="status() === 'all'" (click)="setStatus('all')">{{ 'alertsCenter.filters.allStatus' | translate }}</button>
              <button type="button" [class.active]="status() === 'new'" (click)="setStatus('new')">{{ 'alertsCenter.status.new' | translate }}</button>
              <button type="button" [class.active]="status() === 'read'" (click)="setStatus('read')">{{ 'alertsCenter.status.read' | translate }}</button>
              <button type="button" [class.active]="status() === 'acknowledged'" (click)="setStatus('acknowledged')">{{ 'alertsCenter.status.acknowledged' | translate }}</button>
            </div>
          </div>

          <div class="notification-list">
            @for (item of filteredItems(); track item.id) {
              <article class="notification-card" [class.selected]="selected()?.id === item.id" [ngClass]="[item.category, item.priority, item.status]" (click)="select(item)">
                <span class="type-icon" [ngClass]="[item.category, item.priority]">
                  <mat-icon>{{ notificationService.iconFor(item) }}</mat-icon>
                </span>
                <div class="message-body">
                  <div class="message-topline">
                    <strong>{{ item.title }}</strong>
                    <span class="priority-pill" [ngClass]="item.priority">{{ priorityLabel(item.priority) | translate }}</span>
                  </div>
                  <p>{{ item.message }}</p>
                  <div class="meta-row">
                    <span><mat-icon>schedule</mat-icon>{{ item.time }}</span>
                    <span><mat-icon>apps</mat-icon>{{ item.sourceBc }}</span>
                    @if (item.vehiclePlate) { <span><mat-icon>directions_bus</mat-icon>{{ item.vehiclePlate }}</span> }
                    @if (item.routeName) { <span><mat-icon>alt_route</mat-icon>{{ item.routeName }}</span> }
                  </div>
                </div>
                <div class="row-actions">
                  @if (item.status === 'new') {
                    <button mat-icon-button type="button" [matTooltip]="'alertsCenter.actions.markRead' | translate" (click)="markRead(item, $event)"><mat-icon>drafts</mat-icon></button>
                  }
                  <button mat-icon-button type="button" [matTooltip]="'alertsCenter.actions.acknowledge' | translate" (click)="acknowledge(item, $event)"><mat-icon>check_circle</mat-icon></button>
                  <button mat-icon-button type="button" [matTooltip]="'alertsCenter.actions.remove' | translate" class="danger-button" (click)="remove(item, $event)"><mat-icon>delete</mat-icon></button>
                </div>
              </article>
            } @empty {
              <div class="empty-state">
                <mat-icon>notifications_off</mat-icon>
                <strong>{{ 'alertsCenter.empty.title' | translate }}</strong>
                <p>{{ 'alertsCenter.empty.message' | translate }}</p>
              </div>
            }
          </div>
        </article>

        <aside class="side-stack">
          <article class="center-card detail-panel">
            <div class="section-head compact">
              <div>
                <span class="eyebrow">{{ 'alertsCenter.sections.detailEyebrow' | translate }}</span>
                <h2>{{ 'alertsCenter.sections.detailTitle' | translate }}</h2>
              </div>
              <span class="count-pill">{{ selected()?.category === 'alert' ? ('alertsCenter.filters.alerts' | translate) : ('alertsCenter.filters.notifications' | translate) }}</span>
            </div>

            @if (selected(); as item) {
              <div class="selected-card" [ngClass]="item.priority">
                <span class="type-icon large" [ngClass]="[item.category, item.priority]"><mat-icon>{{ notificationService.iconFor(item) }}</mat-icon></span>
                <h3>{{ item.title }}</h3>
                <p>{{ item.message }}</p>
                <dl>
                  <div><dt>{{ 'alertsCenter.detail.status' | translate }}</dt><dd>{{ statusLabel(item.status) | translate }}</dd></div>
                  <div><dt>{{ 'alertsCenter.detail.priority' | translate }}</dt><dd>{{ priorityLabel(item.priority) | translate }}</dd></div>
                  <div><dt>{{ 'alertsCenter.detail.source' | translate }}</dt><dd>{{ item.sourceBc }}</dd></div>
                  @if (item.vehiclePlate) { <div><dt>{{ 'alertsCenter.detail.vehicle' | translate }}</dt><dd>{{ item.vehiclePlate }}</dd></div> }
                  @if (item.routeName) { <div><dt>{{ 'alertsCenter.detail.route' | translate }}</dt><dd>{{ item.routeName }}</dd></div> }
                  <div><dt>{{ 'alertsCenter.detail.recipient' | translate }}</dt><dd>{{ item.recipientRole }}</dd></div>
                </dl>
                <div class="detail-actions">
                  <button type="button" (click)="notificationService.acknowledge(item.id)">{{ item.actionLabel ?? ('alertsCenter.actions.acknowledge' | translate) }}</button>
                  <button type="button" class="ghost" (click)="notificationService.markAsRead(item.id)">{{ 'alertsCenter.actions.markRead' | translate }}</button>
                </div>
              </div>
            }
          </article>

          <article class="center-card timeline-panel">
            <div class="section-head compact">
              <div>
                <span class="eyebrow">{{ 'alertsCenter.sections.timelineEyebrow' | translate }}</span>
                <h2>{{ 'alertsCenter.sections.timelineTitle' | translate }}</h2>
              </div>
              <span class="count-pill">{{ 'alertsCenter.sections.today' | translate }}</span>
            </div>
            <div class="activity-list">
              @for (activity of notificationService.activities(); track activity.id) {
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
    </section>
  `,
  styles: [`
    .notifications-page { display: grid; gap: 22px; }
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
    .metric-icon.teal { color: #0f766e; background: #ccfbf1; }
    .metric-card small { color: #64748b; font-weight: 800; }
    .metric-card strong { display: block; margin-top: 4px; font-size: 1.9rem; line-height: 1; }
    .metric-card p { margin-top: 8px; color: var(--kw-muted); font-size: .84rem; }
    .command-banner { display: flex; align-items: center; gap: 16px; padding: 16px 18px; border: 1px solid rgba(245, 158, 11, .32); border-radius: 20px; background: linear-gradient(90deg, rgba(255, 251, 235, .96), rgba(255, 255, 255, .82)); }
    .command-banner > span { width: 42px; height: 42px; border-radius: 15px; display: grid; place-items: center; color: #d97706; background: #fef3c7; }
    .command-banner strong { display: block; color: #92400e; }
    .command-banner p { color: #64748b; }
    .command-banner button { margin-left: auto; border: 0; border-radius: 14px; padding: 11px 16px; color: #075985; background: #e0f2fe; font-weight: 900; cursor: pointer; }
    .main-grid { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 22px; align-items: start; }
    .center-card { border: 1px solid var(--kw-border); border-radius: 24px; background: var(--kw-card); box-shadow: var(--kw-shadow); }
    .stream-card { padding: 20px; }
    .section-head { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-bottom: 16px; }
    .section-head h2 { font-size: 1.7rem; letter-spacing: -.04em; }
    .section-head.compact h2 { font-size: 1.35rem; }
    .primary-action { border-radius: 14px !important; background: var(--kw-blue-700) !important; color: #fff !important; font-weight: 900 !important; }
    .filters-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .filters-row.secondary { justify-content: space-between; flex-wrap: wrap; }
    .search-control { flex: 1; min-width: 260px; height: 44px; display: flex; align-items: center; gap: 10px; padding: 0 14px; border: 1px solid var(--kw-border); border-radius: 16px; background: #fff; }
    .search-control mat-icon { color: var(--kw-blue-700); }
    .search-control input { width: 100%; border: 0; outline: 0; background: transparent; }
    .chip-row { display: flex; gap: 8px; flex-wrap: wrap; }
    .chip-row button { min-height: 38px; border: 1px solid var(--kw-border); border-radius: 999px; display: inline-flex; align-items: center; gap: 7px; padding: 0 14px; color: #334155; background: #fff; font-weight: 900; cursor: pointer; }
    .chip-row button mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .chip-row button.active { color: #fff; background: var(--kw-blue-700); box-shadow: 0 12px 22px rgba(34, 131, 198, .22); }
    .notification-list { display: grid; gap: 12px; margin-top: 16px; }
    .notification-card { display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: center; padding: 16px; border: 1px solid var(--kw-border); border-left: 5px solid transparent; border-radius: 18px; background: rgba(255,255,255,.9); cursor: pointer; transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
    .notification-card:hover, .notification-card.selected { transform: translateY(-1px); box-shadow: 0 16px 30px rgba(15,43,87,.08); border-color: rgba(34, 131, 198, .34); }
    .notification-card.alert { border-left-color: #f59e0b; }
    .notification-card.notification { border-left-color: var(--kw-blue-700); }
    .notification-card.critical { border-left-color: #ef4444; }
    .notification-card.acknowledged { opacity: .76; }
    .type-icon { width: 44px; height: 44px; border-radius: 15px; display: grid; place-items: center; background: #e0f2fe; color: var(--kw-blue-700); }
    .type-icon.large { width: 54px; height: 54px; }
    .type-icon.alert { background: #fef3c7; color: #d97706; }
    .type-icon.critical { background: #fee2e2; color: #ef4444; }
    .message-topline { display: flex; align-items: center; gap: 10px; justify-content: space-between; }
    .message-topline strong { color: #0f172a; font-size: .98rem; }
    .message-body p { margin-top: 4px; color: #64748b; }
    .meta-row { display: flex; flex-wrap: wrap; gap: 10px 16px; margin-top: 10px; color: #64748b; font-size: .82rem; font-weight: 700; }
    .meta-row span { display: inline-flex; align-items: center; gap: 5px; }
    .meta-row mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .priority-pill, .count-pill { border-radius: 999px; padding: 6px 10px; font-size: .74rem; font-weight: 900; background: #e0f2fe; color: var(--kw-blue-700); white-space: nowrap; }
    .priority-pill.critical, .priority-pill.high { background: #fee2e2; color: #dc2626; }
    .priority-pill.medium { background: #fef3c7; color: #b45309; }
    .priority-pill.low { background: #dcfce7; color: #047857; }
    .row-actions { display: flex; align-items: center; gap: 3px; }
    .row-actions button { background: #eaf6ff; color: var(--kw-blue-700); }
    .row-actions .danger-button { background: #fee2e2; color: #dc2626; }
    .side-stack { display: grid; gap: 18px; }
    .detail-panel, .timeline-panel { padding: 18px; }
    .selected-card { padding: 16px; border-radius: 18px; background: #f8fbff; border: 1px solid var(--kw-border); }
    .selected-card h3 { margin-top: 12px; font-size: 1.15rem; }
    .selected-card p { margin-top: 8px; color: #64748b; }
    dl { display: grid; gap: 8px; margin: 16px 0 0; }
    dl div { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1px solid #eaf1f8; }
    dt { color: #64748b; font-weight: 800; }
    dd { margin: 0; color: #0f172a; font-weight: 900; text-align: right; }
    .detail-actions { display: flex; gap: 10px; margin-top: 16px; }
    .detail-actions button { border: 0; border-radius: 14px; padding: 11px 14px; background: var(--kw-blue-700); color: #fff; font-weight: 900; cursor: pointer; }
    .detail-actions button.ghost { background: #e0f2fe; color: #075985; }
    .activity-list { display: grid; gap: 12px; }
    .activity-item { display: grid; grid-template-columns: auto 1fr; gap: 10px; padding: 14px; border-radius: 16px; background: #fff; border: 1px solid var(--kw-border); }
    .activity-item > span { width: 10px; height: 10px; border-radius: 999px; margin-top: 4px; background: var(--kw-blue-700); }
    .activity-item.completed > span { background: #10b981; }
    .activity-item.pending > span { background: #f59e0b; }
    .activity-item strong { color: #0f172a; }
    .activity-item p { margin-top: 4px; color: #64748b; font-size: .9rem; }
    .empty-state { min-height: 220px; display: grid; place-items: center; text-align: center; color: #64748b; }
    .empty-state mat-icon { font-size: 42px; width: 42px; height: 42px; color: #94a3b8; }
    @media (max-width: 1180px) { .metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .main-grid { grid-template-columns: 1fr; } }
    @media (max-width: 760px) { .hero-card { align-items: flex-start; flex-direction: column; } .metric-grid { grid-template-columns: 1fr; } .filters-row { align-items: stretch; flex-direction: column; } .notification-card { grid-template-columns: auto 1fr; } .row-actions { grid-column: 1 / -1; justify-content: flex-end; } }
  `]
})
export class AlertNotificationCenterComponent {
  protected readonly notificationService = inject(NotificationService);
  protected readonly query = signal('');
  protected readonly category = signal<'all' | NotificationCategory>('all');
  protected readonly priority = signal<'all' | NotificationPriority>('all');
  protected readonly status = signal<'all' | NotificationStatus>('all');
  protected readonly filteredItems = computed(() => this.notificationService.filteredItems(this.category(), this.priority(), this.status(), this.query()));
  protected readonly summary = this.notificationService.summary;
  protected readonly selected = signal<NotificationItem | null>(null);

  constructor() {
    this.notificationService.load();
    effect(() => {
      const items = this.filteredItems();
      const selectedId = this.selected()?.id;
      if (!selectedId || !items.some((item) => item.id === selectedId)) {
        this.selected.set(items[0] ?? null);
      }
    });
  }

  protected setCategory(value: 'all' | NotificationCategory): void { this.category.set(value); }
  protected setPriority(value: 'all' | NotificationPriority): void { this.priority.set(value); }
  protected setStatus(value: 'all' | NotificationStatus): void { this.status.set(value); }
  protected select(item: NotificationItem): void { this.selected.set(item); }

  protected markRead(item: NotificationItem, event: Event): void {
    event.stopPropagation();
    this.notificationService.markAsRead(item.id);
  }

  protected acknowledge(item: NotificationItem, event: Event): void {
    event.stopPropagation();
    this.notificationService.acknowledge(item.id);
  }

  protected remove(item: NotificationItem, event: Event): void {
    event.stopPropagation();
    this.notificationService.remove(item.id);
  }

  protected exportCurrent(): void {
    this.notificationService.exportCsv(this.filteredItems());
  }

  protected priorityLabel(priority: NotificationPriority): string {
    return `alertsCenter.priority.${priority}`;
  }

  protected statusLabel(status: NotificationStatus): string {
    return `alertsCenter.status.${status}`;
  }
}
