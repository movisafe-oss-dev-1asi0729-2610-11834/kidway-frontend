import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingService } from '../../../application/services/tracking.service';
import { VehicleLocation } from '../../../domain/models/location.model';

@Component({
  selector: 'app-live-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tracking-container">
      <h2>Monitoreo en Tiempo Real - KidsOnWay</h2>
      
      <div class="fleet-grid">
        @for (vehicle of vehicleList; track vehicle.vehicleId) {
          <div class="status-card">
            <div class="card-header">
              <span class="badge">EN RUTA</span>
              <strong>{{ vehicle.vehicleId }}</strong>
            </div>
            <p>📍 <strong>Distrito:</strong> {{ vehicle.district }}</p>
            <p>🏎️ <strong>Velocidad:</strong> {{ vehicle.speed | number:'1.1-1' }} km/h</p>
            <small>Lat: {{ vehicle.latitude | number:'1.3-3' }}, Lng: {{ vehicle.longitude | number:'1.3-3' }}</small>
          </div>
        } @empty {
          <p>Buscando unidades disponibles...</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .fleet-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; margin-top: 20px; }
    .status-card { padding: 15px; border: 2px solid #e0e0e0; border-radius: 12px; background: #f9f9f9; }
    .card-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .badge { background: #4CAF50; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.7em; }
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