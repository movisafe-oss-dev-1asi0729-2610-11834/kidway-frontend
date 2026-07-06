import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { RouteDashboardModel } from '../../domain/models/route-dashboard.model';
import { RouteApiService } from '../../infrastructure/http/route-api.service';
import { RouteFilterState } from '../state/route-filter.state';

@Injectable({ providedIn: 'root' })
export class RouteFacadeService {
  private readonly api = inject(RouteApiService);
  private readonly filters = inject(RouteFilterState);

  loadDashboard(): Observable<RouteDashboardModel> {
    return this.api.getDashboard().pipe(tap((dashboard) => this.filters.setRoutes(dashboard.routes)));
  }
}
