import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { SubscriptionPlanEntity } from '../../../domain/entities/subscription-plan.entity';

@Component({
  selector: 'kw-plan-card',
  standalone: true,
  imports: [CurrencyPipe, NgClass, MatIconModule, TranslateModule],
  templateUrl: './plan-card.component.html',
  styleUrl: './plan-card.component.css'
})
export class PlanCardComponent {
  @Input({ required: true }) plan!: SubscriptionPlanEntity;
  @Output() selected = new EventEmitter<string>();

  onSelect(): void {
    this.selected.emit(this.plan.id);
  }
}
