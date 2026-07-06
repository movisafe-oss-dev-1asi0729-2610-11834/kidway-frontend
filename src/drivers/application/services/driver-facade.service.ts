import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DriverEntity } from '../../domain/entities/driver.entity';
import { DriverDashboardModel } from '../../domain/models/driver-dashboard.model';
import { DriverApiService } from '../../infrastructure/http/driver-api.service';
import { DriverFilterState } from '../state/driver-filter.state';

@Injectable({ providedIn: 'root' })
export class DriverFacadeService {
  private readonly api = inject(DriverApiService);
  private readonly filters = inject(DriverFilterState);

  loadDashboard(): Observable<DriverDashboardModel> {
    return this.api.getDashboard().pipe(tap((dashboard) => this.filters.setDrivers(dashboard.drivers)));
  }

  createDriver(driver: DriverEntity): Observable<DriverEntity> {
    return this.api.createDriver(driver).pipe(
      tap((created) => this.filters.setDrivers([created, ...this.filters.drivers()]))
    );
  }
}
