import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as L from 'leaflet';
import { TrackingFacadeService } from '../../../application/services/tracking-facade.service';
import { TrackingFilterState } from '../../../application/state/tracking-filter.state';
import { TrackingVehicleEntity } from '../../../domain/entities/tracking-vehicle.entity';
import { TrackingStatus } from '../../../domain/models/tracking-status.type';
import { TrackingDashboardModel } from '../../../domain/models/tracking-dashboard.model';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = defaultIcon;

@Component({
  selector: 'kw-real-time-tracking-page',
  standalone: true,
  imports: [CommonModule, DecimalPipe, FormsModule, TranslateModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './real-time-tracking-page.component.html',
  styleUrl: './real-time-tracking-page.component.css'
})
export class RealTimeTrackingPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') private readonly mapContainer?: ElementRef<HTMLDivElement>;

  private readonly facade = inject(TrackingFacadeService);
  protected readonly filters = inject(TrackingFilterState);

  protected readonly dashboard = signal<TrackingDashboardModel | null>(null);
  protected readonly selectedVehicle = signal<TrackingVehicleEntity | null>(null);
  protected readonly isRefreshing = signal(false);

  protected readonly vehicles = computed(() => this.dashboard()?.vehicles ?? []);
  protected readonly filteredVehicles = computed(() => this.filters.filterVehicles(this.vehicles()));
  protected readonly summary = computed(() => this.dashboard()?.summary);
  protected readonly alerts = computed(() => this.dashboard()?.alerts ?? []);
  protected readonly activities = computed(() => this.dashboard()?.activities ?? []);

  private map: L.Map | null = null;
  private markers: L.Marker[] = [];
  private readonly statusClass: Record<TrackingStatus, string> = {
    'on-route': 'status-on-route',
    delayed: 'status-delayed',
    stopped: 'status-stopped',
    offline: 'status-offline'
  };
  private readonly statusLabel: Record<TrackingStatus, string> = {
    'on-route': 'On route',
    delayed: 'Delayed',
    stopped: 'Stopped',
    offline: 'Offline'
  };

  constructor() {
    this.loadDashboard();

    effect(() => {
      const vehicles = this.filteredVehicles();
      if (this.map) {
        this.updateMarkers(vehicles);
      }
      if (!this.selectedVehicle() && vehicles.length > 0) {
        this.selectedVehicle.set(vehicles[0]);
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initializeMap(), 150);
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = null;
  }

  protected loadDashboard(): void {
    this.isRefreshing.set(true);
    this.facade.loadDashboard().subscribe({
      next: (dashboard) => {
        this.dashboard.set(dashboard);
        this.selectedVehicle.set(dashboard.vehicles[0] ?? null);
        this.isRefreshing.set(false);
        setTimeout(() => this.updateMarkers(this.filteredVehicles()), 120);
      },
      error: () => this.isRefreshing.set(false)
    });
  }

  protected refresh(): void {
    this.loadDashboard();
  }

  protected selectVehicle(vehicle: TrackingVehicleEntity): void {
    this.selectedVehicle.set(vehicle);
    if (this.map) {
      this.map.setView([vehicle.latitude, vehicle.longitude], 14, { animate: true });
    }
  }

  protected setStatus(status: TrackingStatus | 'all'): void {
    this.filters.status.set(status);
  }

  protected statusBadgeClass(status: TrackingStatus): string {
    return this.statusClass[status];
  }

  protected statusText(status: TrackingStatus): string {
    return this.statusLabel[status];
  }

  protected exportTrackingSnapshot(): void {
    const headers = ['Vehicle', 'Driver', 'Route', 'District', 'Status', 'Speed', 'ETA', 'Progress', 'Last update'];
    const rows = this.filteredVehicles().map((vehicle) => [
      vehicle.vehicleId,
      vehicle.driverName,
      vehicle.routeName,
      vehicle.district,
      this.statusText(vehicle.status),
      `${vehicle.speedKmh} km/h`,
      `${vehicle.etaMinutes} min`,
      `${vehicle.progressPercent}%`,
      vehicle.lastUpdate
    ]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kidway-tracking-snapshot.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  private initializeMap(): void {
    if (!this.mapContainer || this.map) {
      return;
    }

    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: true,
      attributionControl: true
    }).setView([-12.105, -77.015], 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap & CartoDB',
      maxZoom: 18,
      minZoom: 10
    }).addTo(this.map);

    this.map.setMaxBounds([
      [-12.35, -77.25],
      [-11.85, -76.70]
    ]);

    this.updateMarkers(this.filteredVehicles());
    setTimeout(() => this.map?.invalidateSize(), 200);
  }

  private updateMarkers(vehicles: TrackingVehicleEntity[]): void {
    if (!this.map) {
      return;
    }

    this.markers.forEach((marker) => marker.remove());
    this.markers = vehicles.map((vehicle) => {
      const marker = L.marker([vehicle.latitude, vehicle.longitude])
        .bindPopup(`
          <strong>${vehicle.vehicleId}</strong><br>
          ${vehicle.driverName}<br>
          ${vehicle.routeName}<br>
          ETA: ${vehicle.etaMinutes} min
        `)
        .on('click', () => this.selectedVehicle.set(vehicle))
        .addTo(this.map as L.Map);
      return marker;
    });

    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.18));
      setTimeout(() => this.map?.invalidateSize(), 80);
    }
  }
}
