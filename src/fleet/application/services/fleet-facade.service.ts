import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { FleetDashboardModel } from '../../domain/models/fleet-dashboard.model';
import { VehicleEntity } from '../../domain/entities/vehicle.entity';
import { FleetApiService } from '../../infrastructure/http/fleet-api.service';
import { FleetFilterState } from '../state/fleet-filter.state';

@Injectable({ providedIn: 'root' })
export class FleetFacadeService {
  private readonly api = inject(FleetApiService);
  private readonly filters = inject(FleetFilterState);

  loadDashboard(): Observable<FleetDashboardModel> {
    return this.api.getDashboard().pipe(tap((dashboard) => this.filters.setVehicles(dashboard.vehicles)));
  }

  createVehicle(vehicle: VehicleEntity): Observable<VehicleEntity> {
    return this.api.createVehicle(vehicle).pipe(
      tap((created) => this.filters.setVehicles([created, ...this.filters.vehicles()]))
    );
  }
}
