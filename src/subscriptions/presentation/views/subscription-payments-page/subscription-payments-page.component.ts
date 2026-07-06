import { AsyncPipe, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { SubscriptionsFacadeService } from '../../../application/services/subscriptions-facade.service';
import { BillingRecordModel } from '../../../domain/models/billing-record.model';
import { CurrentSubscriptionModel } from '../../../domain/models/current-subscription.model';

@Component({
  selector: 'kw-subscription-payments-page',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, DatePipe, NgClass, ReactiveFormsModule, MatIconModule, TranslateModule],
  templateUrl: './subscription-payments-page.component.html',
  styleUrl: './subscription-payments-page.component.css'
})
export class SubscriptionPaymentsPageComponent {
  private readonly facade = inject(SubscriptionsFacadeService);
  private readonly fb = inject(FormBuilder);

  protected readonly dashboard$ = this.facade.loadDashboard();
  protected readonly showCardForm = signal(false);
  protected readonly cardSavedMessage = signal(false);
  protected readonly receiptMessage = signal<string | null>(null);

  protected readonly cardForm = this.fb.nonNullable.group({
    holder: ['', [Validators.required, Validators.minLength(3)]],
    brand: ['visa' as 'visa' | 'mastercard' | 'amex', [Validators.required]],
    cardNumber: ['', [Validators.required, Validators.minLength(12)]],
    expiresOn: ['', [Validators.required]],
    billingAlias: ['Company payment method']
  });

  percentage(used: number, limit: number | null): number {
    if (!limit) return 100;
    return Math.min(Math.round((used / limit) * 100), 100);
  }

  daysUntilRenewal(renewsOn: string): number {
    const today = new Date();
    const renewal = new Date(renewsOn);
    return Math.max(Math.ceil((renewal.getTime() - today.getTime()) / 86_400_000), 0);
  }

  serviceDays(subscription: CurrentSubscriptionModel): number {
    const startDate = new Date(subscription.startedOn ?? '2026-01-15');
    const today = new Date();
    return Math.max(Math.ceil((today.getTime() - startDate.getTime()) / 86_400_000), 1);
  }

  lastPayment(records: BillingRecordModel[]): BillingRecordModel | null {
    return records.length > 0 ? records[0] : null;
  }

  toggleCardForm(): void {
    this.showCardForm.update((value) => !value);
    this.cardSavedMessage.set(false);
  }

  submitMockCard(): void {
    if (this.cardForm.invalid) {
      this.cardForm.markAllAsTouched();
      return;
    }

    this.cardSavedMessage.set(true);
    this.showCardForm.set(false);
    this.cardForm.reset({
      holder: '',
      brand: 'visa',
      cardNumber: '',
      expiresOn: '',
      billingAlias: 'Company payment method'
    });
    setTimeout(() => this.cardSavedMessage.set(false), 2800);
  }

  requestReceipt(record: BillingRecordModel): void {
    this.receiptMessage.set(record.id);
    setTimeout(() => this.receiptMessage.set(null), 2800);
  }
}
