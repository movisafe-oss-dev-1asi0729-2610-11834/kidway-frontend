import { NgClass } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { StudentEntity } from '../../../domain/entities/student.entity';

@Component({
  selector: 'kw-student-detail-dialog',
  standalone: true,
  imports: [NgClass, MatButtonModule, MatDialogModule, MatIconModule, TranslateModule],
  template: `
    <section class="student-detail-dialog">
      <header>
        <span class="avatar">{{ initials }}</span>
        <div>
          <p>{{ 'studentsPage.dialogs.detailEyebrow' | translate }}</p>
          <h2>{{ fullName }}</h2>
          <small>{{ data.code }} · {{ data.grade }}</small>
        </div>
        <button mat-icon-button type="button" mat-dialog-close aria-label="Close student details">
          <mat-icon>close</mat-icon>
        </button>
      </header>

      <mat-dialog-content>
        <div class="status-row">
          <span class="status-pill" [ngClass]="data.status">{{ 'studentsPage.status.' + data.status | translate }}</span>
          <span class="auth-pill" [ngClass]="data.authorizationStatus">
            <mat-icon>{{ data.authorizationStatus === 'verified' ? 'verified' : 'priority_high' }}</mat-icon>
            {{ 'studentsPage.authorization.' + data.authorizationStatus | translate }}
          </span>
        </div>

        <div class="detail-grid">
          <article>
            <small>{{ 'studentsPage.table.school' | translate }}</small>
            <strong>{{ data.school }}</strong>
          </article>
          <article>
            <small>{{ 'studentsPage.table.guardian' | translate }}</small>
            <strong>{{ data.guardianName }}</strong>
            <span>{{ data.guardianPhone }}</span>
          </article>
          <article>
            <small>{{ 'studentsPage.card.route' | translate }}</small>
            <strong>{{ data.routeName ?? ('studentsPage.unassignedRoute' | translate) }}</strong>
            <span>{{ data.assignedVehicle ?? ('studentsPage.emptyValue' | translate) }}</span>
          </article>
          <article>
            <small>{{ 'studentsPage.card.driver' | translate }}</small>
            <strong>{{ data.assignedDriver ?? ('studentsPage.pendingAssignment' | translate) }}</strong>
          </article>
          <article>
            <small>{{ 'studentsPage.card.window' | translate }}</small>
            <strong>{{ data.pickupWindow ?? ('studentsPage.pendingAssignment' | translate) }}</strong>
          </article>
          <article>
            <small>{{ 'studentsPage.dialogs.pickupPoint' | translate }}</small>
            <strong>{{ data.pickupPoint ?? ('studentsPage.emptyValue' | translate) }}</strong>
          </article>
        </div>

        <div class="progress-block">
          <div>
            <span>{{ 'studentsPage.card.attendance' | translate }}</span>
            <strong>{{ data.attendanceRate }}%</strong>
          </div>
          <span class="bar"><i [style.width.%]="data.attendanceRate"></i></span>
        </div>

        @if (data.notes) {
          <div class="notes">
            <small>{{ 'studentsPage.dialogs.notes' | translate }}</small>
            <p>{{ data.notes }}</p>
          </div>
        }
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-flat-button color="primary" mat-dialog-close>{{ 'studentsPage.dialogs.close' | translate }}</button>
      </mat-dialog-actions>
    </section>
  `,
  styles: [`
    .student-detail-dialog { width: min(760px, 94vw); max-width: 100%; color: var(--kw-ink); overflow: hidden; }
    header { display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: center; padding: 4px 2px 14px; }
    .avatar { display: inline-flex; align-items: center; justify-content: center; width: 52px; height: 52px; border-radius: 18px; color: #fff; background: linear-gradient(135deg, #1c84c7, #126199); font-weight: 900; }
    h2, p, small { margin: 0; }
    header p { color: #1682c6; font-size: .74rem; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
    header h2 { color: #0f172a; font-size: 1.7rem; letter-spacing: -.04em; }
    header small, article span, .progress-block span, .notes p { color: #64748b; }
    .status-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 18px; }
    .status-pill, .auth-pill { display: inline-flex; align-items: center; gap: 7px; border-radius: 999px; padding: 8px 12px; font-size: .78rem; font-weight: 900; }
    .status-pill.active, .auth-pill.verified { color: #067647; background: #dcfce7; }
    .status-pill.unassigned, .auth-pill.pending { color: #a16207; background: #fef3c7; }
    .status-pill.review, .auth-pill.expired { color: #b45309; background: #fff7ed; }
    .status-pill.inactive { color: #475569; background: #e2e8f0; }
    .detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
    article, .progress-block, .notes { border: 1px solid #e5eef7; border-radius: 16px; background: #f8fbfe; padding: 14px; }
    article small, .notes small { display: block; color: #718096; font-size: .72rem; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 5px; }
    article strong { display: block; color: var(--kw-ink); font-size: .95rem; }
    .progress-block { display: grid; gap: 9px; margin-top: 14px; }
    .progress-block div { display: flex; justify-content: space-between; font-weight: 900; }
    .progress-block strong { color: #0f5f98; }
    .bar { display: block; overflow: hidden; height: 9px; border-radius: 999px; background: #e7f0f8; }
    .bar i { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #2186c8, #28c4b7); }
    .notes { margin-top: 14px; }
    .notes p { margin: 0; line-height: 1.45; }
    mat-icon { width: 18px; height: 18px; font-size: 18px; }
    @media (max-width: 620px) { .detail-grid { grid-template-columns: 1fr; } header { grid-template-columns: auto 1fr; } header button { grid-column: 1 / -1; justify-self: end; } }
  `]
})
export class StudentDetailDialogComponent {
  constructor(
    public readonly dialogRef: MatDialogRef<StudentDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: StudentEntity
  ) {}

  get fullName(): string {
    return `${this.data.firstName} ${this.data.lastName}`;
  }

  get initials(): string {
    return `${this.data.firstName.charAt(0)}${this.data.lastName.charAt(0)}`.toUpperCase();
  }
}
