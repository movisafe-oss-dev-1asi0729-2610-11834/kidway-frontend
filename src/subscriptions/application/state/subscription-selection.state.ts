import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SubscriptionSelectionState {
  readonly selectedPlanId = signal<string>('pro');

  selectPlan(planId: string): void {
    this.selectedPlanId.set(planId);
  }
}
