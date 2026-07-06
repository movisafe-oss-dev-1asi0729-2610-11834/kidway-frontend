import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { FleetDashboardModel } from '../../domain/models/fleet-dashboard.model';
import { FleetApiService } from '../../infrastructure/http/fleet-api.service';
import { FleetFilterState } from '../state/fleet-filter.state';

@Injectable({ providedIn: 'root' })
export class FleetFacadeService {
  private readonly api = inject(FleetApiService);
  private readonly filters = inject(FleetFilterState);

  loadDashboard(): Observable<FleetDashboardModel> {
    return this.api.getDashboard().pipe(tap((dashboard) => this.filters.setVehicles(dashboard.vehicles)));
  }
}
