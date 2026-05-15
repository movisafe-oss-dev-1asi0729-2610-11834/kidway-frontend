import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SubscriptionDashboardModel } from '../../domain/models/subscription-dashboard.model';
import { SubscriptionsApiService } from '../../infrastructure/http/subscriptions-api.service';

@Injectable({ providedIn: 'root' })
export class SubscriptionsFacadeService {
  private readonly api = inject(SubscriptionsApiService);

  loadDashboard(): Observable<SubscriptionDashboardModel> {
    return this.api.getDashboard();
  }
}
