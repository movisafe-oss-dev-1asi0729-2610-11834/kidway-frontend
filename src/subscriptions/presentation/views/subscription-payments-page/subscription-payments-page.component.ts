import { AsyncPipe, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { SubscriptionsFacadeService } from '../../../application/services/subscriptions-facade.service';
import { SubscriptionSelectionState } from '../../../application/state/subscription-selection.state';
import { PlanCardComponent } from '../../components/plan-card/plan-card.component';

@Component({
  selector: 'kw-subscription-payments-page',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, DatePipe, NgClass, MatIconModule, TranslateModule, PlanCardComponent],
  templateUrl: './subscription-payments-page.component.html',
  styleUrl: './subscription-payments-page.component.css'
})
export class SubscriptionPaymentsPageComponent {
  private readonly facade = inject(SubscriptionsFacadeService);
  protected readonly selection = inject(SubscriptionSelectionState);
  protected readonly dashboard$ = this.facade.loadDashboard();

  percentage(used: number, limit: number | null): number {
    if (!limit) return 100;
    return Math.min(Math.round((used / limit) * 100), 100);
  }

  selectPlan(planId: string): void {
    this.selection.selectPlan(planId);
  }
}
