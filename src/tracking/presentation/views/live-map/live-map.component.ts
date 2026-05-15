import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // 1. Importación necesaria
import { TrackingService } from '../../../application/services/tracking.service';
import { VehicleLocation } from '../../../domain/models/location.model';

@Component({
  selector: 'app-live-map',
  standalone: true,
  imports: [CommonModule], // 2. Agregamos CommonModule aquí
  template: `
    <div class="tracking-container">
      <h2>Live Map - KidsOnWay</h2>
      
      @if (currentLocation) {
        <div class="status-card">
          <p><strong>Unidad:</strong> {{ currentLocation.vehicleId }}</p>
          <p><strong>Ubicación:</strong> 
            {{ currentLocation.latitude | number:'1.4-4' }}, 
            {{ currentLocation.longitude | number:'1.4-4' }}
          </p>
          <p><strong>Velocidad:</strong> {{ currentLocation.speed | number:'1.1-1' }} km/h</p>
        </div>
      } @else {
        <p>Esperando señal de GPS...</p>
      }
    </div>
  `,
  styles: ['.tracking-container { padding: 20px; border: 1px solid #ccc; border-radius: 8px; }']
})
export class LiveMapComponent implements OnInit {
  currentLocation?: VehicleLocation;

  constructor(private trackingService: TrackingService) {}

  ngOnInit(): void {
    this.trackingService.subscribeToVehicleTracking().subscribe(
      location => this.currentLocation = location
    );
  }
}