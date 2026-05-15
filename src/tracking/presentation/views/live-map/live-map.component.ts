import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core'; 
import { TrackingService } from '../../../application/services/tracking.service';
import { VehicleLocation } from '../../../domain/models/location.model';

@Component({
  selector: 'app-live-map',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="tracking-container">
      <h2>{{ 'tracking.title' | translate }}</h2>
      
      <div class="fleet-grid">
        @for (vehicle of vehicleList; track vehicle.vehicleId) {
          <div class="status-card">
            <div class="card-header">
              <span class="badge">{{ 'tracking.status' | translate }}</span>
              <strong>{{ vehicle.vehicleId }}</strong>
            </div>
            <p>📍 <strong>{{ 'tracking.district' | translate }}:</strong> {{ vehicle.district }}</p>
            <p>🏎️ <strong>{{ 'tracking.speed' | translate }}:</strong> {{ vehicle.speed | number:'1.1-1' }} km/h</p>
            <small>{{ vehicle.latitude | number:'1.3-3' }}, {{ vehicle.longitude | number:'1.3-3' }}</small>
          </div>
        } @empty {
          <p>{{ 'tracking.searching' | translate }}</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .fleet-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; margin-top: 1rem; }
    .status-card { padding: 1rem; border: 1px solid #eee; border-radius: 10px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .badge { background: #2196F3; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; }
  `]
})
export class LiveMapComponent implements OnInit {
  vehicleList: VehicleLocation[] = [];

  constructor(private trackingService: TrackingService) {}

  ngOnInit(): void {
    this.trackingService.subscribeToVehicleTracking().subscribe(
      locations => this.vehicleList = locations
    );
  }
}