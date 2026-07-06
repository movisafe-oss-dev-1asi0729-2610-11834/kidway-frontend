import { DatePipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { CompanyManagementService } from '../../application/services/company-management.service';
import { CompanyContractStatus, CompanyMemberStatus, ComplianceStatus } from '../../domain/models/company-management.model';

@Component({
  selector: 'kw-company-management-view',
  standalone: true,
  imports: [NgClass, DatePipe, TranslateModule, MatButtonModule, MatIconModule],
  template: `
    <section class="companies-page">
      <header class="hero-card">
        <div>
          <span class="eyebrow">{{ 'companiesBc.hero.eyebrow' | translate }}</span>
          <h1>{{ 'companiesBc.hero.title' | translate }}</h1>
          <p>{{ 'companiesBc.hero.subtitle' | translate }}</p>
        </div>
        <aside class="hero-badge">
          <span>{{ 'companiesBc.hero.score' | translate }}</span>
          <strong>{{ service.summary().complianceScore }}%</strong>
        </aside>
      </header>

      <div class="metric-grid">
        <article class="metric-card">
          <span class="metric-icon blue"><mat-icon>business</mat-icon></span>
          <small>{{ 'companiesBc.metrics.company' | translate }}</small>
          <strong>{{ service.summary().activeCompanies }}</strong>
          <p>{{ 'companiesBc.metrics.companyHint' | translate }}</p>
        </article>
        <article class="metric-card">
          <span class="metric-icon cyan"><mat-icon>directions_bus</mat-icon></span>
          <small>{{ 'companiesBc.metrics.vehicles' | translate }}</small>
          <strong>{{ service.summary().totalVehicles }}</strong>
          <p>{{ 'companiesBc.metrics.vehiclesHint' | translate }}</p>
        </article>
        <article class="metric-card">
          <span class="metric-icon green"><mat-icon>badge</mat-icon></span>
          <small>{{ 'companiesBc.metrics.drivers' | translate }}</small>
          <strong>{{ service.summary().activeDrivers }}</strong>
          <p>{{ 'companiesBc.metrics.driversHint' | translate }}</p>
        </article>
        <article class="metric-card">
          <span class="metric-icon amber"><mat-icon>school</mat-icon></span>
          <small>{{ 'companiesBc.metrics.schools' | translate }}</small>
          <strong>{{ service.summary().linkedSchools }}</strong>
          <p>{{ 'companiesBc.metrics.schoolsHint' | translate }}</p>
        </article>
        <article class="metric-card">
          <span class="metric-icon red"><mat-icon>pending_actions</mat-icon></span>
          <small>{{ 'companiesBc.metrics.reviews' | translate }}</small>
          <strong>{{ service.summary().pendingReviews }}</strong>
          <p>{{ 'companiesBc.metrics.reviewsHint' | translate }}</p>
        </article>
      </div>

      <div class="command-banner">
        <span><mat-icon>admin_panel_settings</mat-icon></span>
        <div>
          <strong>{{ 'companiesBc.banner.title' | translate }}</strong>
          <p>{{ 'companiesBc.banner.message' | translate }}</p>
        </div>
        <button type="button" (click)="service.loadDashboard()"><mat-icon>sync</mat-icon>{{ 'companiesBc.actions.refresh' | translate }}</button>
      </div>

      <section class="overview-grid">
        <article class="center-card profile-card">
          <div class="section-head">
            <div>
              <span class="eyebrow">{{ 'companiesBc.sections.profileEyebrow' | translate }}</span>
              <h2>{{ 'companiesBc.sections.profileTitle' | translate }}</h2>
            </div>
            <span class="status-pill" [ngClass]="service.profile().status">{{ ('companiesBc.status.company.' + service.profile().status) | translate }}</span>
          </div>

          <div class="profile-main">
            <span class="company-avatar"><mat-icon>shield</mat-icon></span>
            <div>
              <h3>{{ service.profile().commercialName }}</h3>
              <p>{{ service.profile().legalName }} · RUC {{ service.profile().ruc }}</p>
            </div>
          </div>

          <dl class="profile-details">
            <div><dt>{{ 'companiesBc.profile.admin' | translate }}</dt><dd>{{ service.profile().adminName }}</dd></div>
            <div><dt>{{ 'companiesBc.profile.email' | translate }}</dt><dd>{{ service.profile().adminEmail }}</dd></div>
            <div><dt>{{ 'companiesBc.profile.phone' | translate }}</dt><dd>{{ service.profile().phone }}</dd></div>
            <div><dt>{{ 'companiesBc.profile.address' | translate }}</dt><dd>{{ service.profile().address }}</dd></div>
            <div><dt>{{ 'companiesBc.profile.plan' | translate }}</dt><dd>{{ service.profile().plan }}</dd></div>
            <div><dt>{{ 'companiesBc.profile.license' | translate }}</dt><dd>{{ service.profile().licenseExpiration | date:'mediumDate' }}</dd></div>
          </dl>

          <div class="district-row">
            @for (district of service.profile().operatingDistricts; track district) {
              <span>{{ district }}</span>
            }
          </div>
        </article>

        <aside class="center-card score-card">
          <div class="section-head compact">
            <div>
              <span class="eyebrow">{{ 'companiesBc.sections.readinessEyebrow' | translate }}</span>
              <h2>{{ 'companiesBc.sections.readinessTitle' | translate }}</h2>
            </div>
            <span class="count-pill">{{ service.summary().serviceQualityScore }}%</span>
          </div>
          <div class="donut" [style.background]="donutStyle(service.summary().serviceQualityScore)">
            <div>
              <strong>{{ service.summary().serviceQualityScore }}%</strong>
              <span>{{ 'companiesBc.labels.readyCompany' | translate }}</span>
            </div>
          </div>
          <div class="legend-row">
            <span><i class="green-dot"></i>{{ 'companiesBc.labels.profile' | translate }}</span>
            <span><i class="blue-dot"></i>{{ 'companiesBc.labels.contracts' | translate }}</span>
            <span><i class="amber-dot"></i>{{ 'companiesBc.labels.compliance' | translate }}</span>
          </div>
        </aside>
      </section>

      <section class="content-grid">
        <article class="center-card contracts-card">
          <div class="section-head">
            <div>
              <span class="eyebrow">{{ 'companiesBc.sections.contractsEyebrow' | translate }}</span>
              <h2>{{ 'companiesBc.sections.contractsTitle' | translate }}</h2>
            </div>
            <button mat-flat-button type="button" class="primary-action" (click)="service.exportCsv()"><mat-icon>download</mat-icon>{{ 'companiesBc.actions.export' | translate }}</button>
          </div>

          <div class="filters-row">
            <label class="search-control">
              <mat-icon>search</mat-icon>
              <input type="search" [placeholder]="'companiesBc.filters.search' | translate" [value]="service.query()" (input)="service.query.set($any($event.target).value)">
            </label>
            <div class="chip-row">
              @for (option of contractStatusOptions; track option.value) {
                <button type="button" [class.active]="service.contractStatus() === option.value" (click)="service.setContractStatus(option.value)"><mat-icon>{{ option.icon }}</mat-icon>{{ option.labelKey | translate }}</button>
              }
            </div>
          </div>

          <div class="contract-list">
            @for (contract of service.filteredContracts(); track contract.id) {
              <article class="contract-row" [class.selected]="service.selectedContract().id === contract.id" [ngClass]="contract.status" (click)="service.selectContract(contract.id)">
                <span class="contract-icon" [ngClass]="contract.status"><mat-icon>{{ contractIcon(contract.status) }}</mat-icon></span>
                <div class="contract-main">
                  <div class="contract-title">
                    <div>
                      <strong>{{ contract.schoolName }}</strong>
                      <p>{{ contract.district }} · {{ contract.contactName }}</p>
                    </div>
                    <span class="status-pill" [ngClass]="contract.status">{{ service.contractStatusLabel(contract.status) | translate }}</span>
                  </div>
                  <div class="contract-stats">
                    <div><small>{{ 'companiesBc.contract.routes' | translate }}</small><strong>{{ contract.routeCount }}</strong></div>
                    <div><small>{{ 'companiesBc.contract.students' | translate }}</small><strong>{{ contract.studentCount }}</strong></div>
                    <div><small>{{ 'companiesBc.contract.renewal' | translate }}</small><strong>{{ contract.renewalDate | date:'MMM d' }}</strong></div>
                  </div>
                  <div class="progress-row"><span>{{ 'companiesBc.contract.score' | translate }}</span><strong>{{ contract.score }}%</strong><i><em [style.width.%]="contract.score"></em></i></div>
                </div>
                <button mat-icon-button type="button" aria-label="Select contract" (click)="service.selectContract(contract.id); $event.stopPropagation()"><mat-icon>arrow_forward</mat-icon></button>
              </article>
            } @empty {
              <div class="empty-state"><mat-icon>business_center</mat-icon><strong>{{ 'companiesBc.empty.title' | translate }}</strong><p>{{ 'companiesBc.empty.message' | translate }}</p></div>
            }
          </div>
        </article>

        <aside class="side-stack">
          <article class="center-card detail-card">
            <div class="section-head compact">
              <div>
                <span class="eyebrow">{{ 'companiesBc.sections.selectedEyebrow' | translate }}</span>
                <h2>{{ 'companiesBc.sections.selectedTitle' | translate }}</h2>
              </div>
              <span class="status-pill" [ngClass]="service.selectedContract().status">{{ service.contractStatusLabel(service.selectedContract().status) | translate }}</span>
            </div>
            @if (service.selectedContract(); as contract) {
              <div class="selected-contract" [ngClass]="contract.status">
                <span class="contract-icon large" [ngClass]="contract.status"><mat-icon>{{ contractIcon(contract.status) }}</mat-icon></span>
                <h3>{{ contract.schoolName }}</h3>
                <p>{{ contract.notes }}</p>
                <dl>
                  <div><dt>{{ 'companiesBc.contract.district' | translate }}</dt><dd>{{ contract.district }}</dd></div>
                  <div><dt>{{ 'companiesBc.contract.contact' | translate }}</dt><dd>{{ contract.contactName }}</dd></div>
                  <div><dt>{{ 'companiesBc.contract.routes' | translate }}</dt><dd>{{ contract.routeCount }}</dd></div>
                  <div><dt>{{ 'companiesBc.contract.students' | translate }}</dt><dd>{{ contract.studentCount }}</dd></div>
                  <div><dt>{{ 'companiesBc.contract.renewal' | translate }}</dt><dd>{{ contract.renewalDate | date:'mediumDate' }}</dd></div>
                  <div><dt>{{ 'companiesBc.contract.score' | translate }}</dt><dd>{{ contract.score }}%</dd></div>
                </dl>
              </div>
            }
          </article>

          <article class="center-card compliance-card">
            <div class="section-head compact">
              <div>
                <span class="eyebrow">{{ 'companiesBc.sections.complianceEyebrow' | translate }}</span>
                <h2>{{ 'companiesBc.sections.complianceTitle' | translate }}</h2>
              </div>
              <span class="count-pill">{{ service.filteredCompliance().length }} {{ 'companiesBc.labels.items' | translate }}</span>
            </div>
            <div class="chip-row stack-filter">
              @for (option of complianceStatusOptions; track option.value) {
                <button type="button" [class.active]="service.complianceStatus() === option.value" (click)="service.setComplianceStatus(option.value)">{{ option.labelKey | translate }}</button>
              }
            </div>
            <div class="compliance-list">
              @for (item of service.filteredCompliance(); track item.id) {
                <article [ngClass]="item.severity">
                  <span><mat-icon>{{ item.status === 'completed' ? 'verified' : 'priority_high' }}</mat-icon></span>
                  <div>
                    <strong>{{ item.title }}</strong>
                    <p>{{ item.description }}</p>
                    <small>{{ item.category }} · {{ item.dueDate | date:'mediumDate' }}</small>
                  </div>
                  @if (item.status !== 'completed') {
                    <button mat-icon-button type="button" aria-label="Complete review" (click)="service.markComplianceCompleted(item.id)"><mat-icon>check_circle</mat-icon></button>
                  }
                </article>
              }
            </div>
          </article>
        </aside>
      </section>

      <section class="lower-grid">
        <article class="center-card team-card">
          <div class="section-head">
            <div>
              <span class="eyebrow">{{ 'companiesBc.sections.teamEyebrow' | translate }}</span>
              <h2>{{ 'companiesBc.sections.teamTitle' | translate }}</h2>
            </div>
            <div class="chip-row">
              @for (option of memberStatusOptions; track option.value) {
                <button type="button" [class.active]="service.memberStatus() === option.value" (click)="service.setMemberStatus(option.value)">{{ option.labelKey | translate }}</button>
              }
            </div>
          </div>
          <div class="member-list">
            @for (member of service.filteredMembers(); track member.id) {
              <article [class.selected]="service.selectedMember().id === member.id" [ngClass]="member.status" (click)="service.selectMember(member.id)">
                <span>{{ initials(member.name) }}</span>
                <div>
                  <strong>{{ member.name }}</strong>
                  <p>{{ member.role }} · {{ member.email }}</p>
                  <small>{{ member.scope }}</small>
                </div>
                <em>{{ service.memberStatusLabel(member.status) | translate }}</em>
              </article>
            }
          </div>
        </article>

        <article class="center-card registry-card">
          <div class="section-head">
            <div>
              <span class="eyebrow">{{ 'companiesBc.sections.registryEyebrow' | translate }}</span>
              <h2>{{ 'companiesBc.sections.registryTitle' | translate }}</h2>
            </div>
          </div>
          <div class="registry-table">
            <table>
              <thead><tr><th>{{ 'companiesBc.table.school' | translate }}</th><th>{{ 'companiesBc.table.district' | translate }}</th><th>{{ 'companiesBc.table.routes' | translate }}</th><th>{{ 'companiesBc.table.students' | translate }}</th><th>{{ 'companiesBc.table.status' | translate }}</th><th>{{ 'companiesBc.table.score' | translate }}</th></tr></thead>
              <tbody>
                @for (contract of service.dashboard().contracts; track contract.id) {
                  <tr>
                    <td><strong>{{ contract.schoolName }}</strong><small>{{ contract.contactName }}</small></td>
                    <td>{{ contract.district }}</td>
                    <td>{{ contract.routeCount }}</td>
                    <td>{{ contract.studentCount }}</td>
                    <td><span class="status-pill" [ngClass]="contract.status">{{ service.contractStatusLabel(contract.status) | translate }}</span></td>
                    <td><div class="table-progress"><span>{{ contract.score }}%</span><i><em [style.width.%]="contract.score"></em></i></div></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </article>

        <article class="center-card activity-card">
          <div class="section-head compact">
            <div>
              <span class="eyebrow">{{ 'companiesBc.sections.activityEyebrow' | translate }}</span>
              <h2>{{ 'companiesBc.sections.activityTitle' | translate }}</h2>
            </div>
            <span class="count-pill">{{ 'companiesBc.labels.today' | translate }}</span>
          </div>
          <div class="activity-list">
            @for (activity of service.dashboard().activities; track activity.id) {
              <article [ngClass]="activity.status">
                <span></span>
                <div><strong>{{ activity.time }} · {{ activity.title }}</strong><p>{{ activity.description }}</p></div>
              </article>
            }
          </div>
        </article>
      </section>
    </section>
  `,
  styleUrl: './company-management-view.component.css'
})
export class CompanyManagementViewComponent {
  protected readonly service = inject(CompanyManagementService);

  protected readonly contractStatusOptions: { value: CompanyContractStatus | 'all'; labelKey: string; icon: string }[] = [
    { value: 'all', labelKey: 'companiesBc.filters.allContracts', icon: 'apps' },
    { value: 'active', labelKey: 'companiesBc.filters.active', icon: 'verified' },
    { value: 'renewal', labelKey: 'companiesBc.filters.renewal', icon: 'event_repeat' },
    { value: 'review', labelKey: 'companiesBc.filters.review', icon: 'manage_search' },
    { value: 'paused', labelKey: 'companiesBc.filters.paused', icon: 'pause_circle' }
  ];

  protected readonly memberStatusOptions: { value: CompanyMemberStatus | 'all'; labelKey: string }[] = [
    { value: 'all', labelKey: 'companiesBc.filters.allMembers' },
    { value: 'active', labelKey: 'companiesBc.filters.active' },
    { value: 'invited', labelKey: 'companiesBc.filters.invited' },
    { value: 'inactive', labelKey: 'companiesBc.filters.inactive' }
  ];

  protected readonly complianceStatusOptions: { value: ComplianceStatus | 'all'; labelKey: string }[] = [
    { value: 'all', labelKey: 'companiesBc.filters.allReviews' },
    { value: 'pending', labelKey: 'companiesBc.filters.pending' },
    { value: 'review', labelKey: 'companiesBc.filters.review' },
    { value: 'completed', labelKey: 'companiesBc.filters.completed' }
  ];

  protected donutStyle(value: number): string {
    const safeValue = Math.max(0, Math.min(100, value));
    return `conic-gradient(#2283c6 ${safeValue}%, #dff1fb ${safeValue}% 100%)`;
  }

  protected contractIcon(status: CompanyContractStatus): string {
    const icons: Record<CompanyContractStatus, string> = {
      active: 'verified',
      renewal: 'event_repeat',
      review: 'manage_search',
      paused: 'pause_circle'
    };
    return icons[status];
  }

  protected initials(name: string): string {
    return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  }
}
