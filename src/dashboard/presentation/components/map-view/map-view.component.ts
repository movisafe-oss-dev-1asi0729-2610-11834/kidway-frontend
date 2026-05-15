import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { Vehicle } from '../../../application/services/mock-data.service';

// Iconos por defecto de Leaflet (desde CDN)
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
    selector: 'app-map-view',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="map-wrapper">
            <div *ngIf="isLoading()" class="map-loading">Cargando mapa...</div>
            <div #mapElement class="map-container" [class.hidden]="isLoading()"></div>
        </div>
    `,
    styles: [`
    .map-wrapper { position: relative; margin-bottom: 1rem; border-radius: 12px; overflow: hidden; }
    .map-container { height: 400px; width: 100%; }
    .map-loading { height: 400px; display: flex; align-items: center; justify-content: center; background: #f0f0f0; border-radius: 12px; font-family: sans-serif; color: #555; }
    .hidden { display: none; }
  `]
})
export class MapViewComponent implements AfterViewInit, OnChanges {
    @ViewChild('mapElement') mapElement!: ElementRef;
    @Input() vehicles: Vehicle[] = [];
    private map: L.Map | null = null;
    private markers: L.Marker[] = [];
    isLoading = signal(true);

    ngAfterViewInit() {
        setTimeout(() => {
            this.initMap();
            this.updateMarkers();
            this.isLoading.set(false);
        }, 100);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['vehicles'] && this.map) {
            this.updateMarkers();
        }
    }

    private initMap() {
        this.map = L.map(this.mapElement.nativeElement).setView([-12.0464, -77.0428], 11);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> & CartoDB',
            maxZoom: 18,
            minZoom: 8
        }).addTo(this.map);
        // Limitar el área visible a Perú (opcional)
        this.map.setMaxBounds([
            [-18.0, -85.0],
            [0.0, -68.0]
        ]);
    }

    private updateMarkers() {
        if (!this.map) return;
        this.markers.forEach(m => this.map!.removeLayer(m));
        this.markers = [];
        this.vehicles.forEach(vehicle => {
            const marker = L.marker([vehicle.lat, vehicle.lng])
                .bindPopup(`
          <b>${vehicle.plate}</b><br/>
          Conductor: ${vehicle.driverName}<br/>
          Estado: ${vehicle.status}<br/>
          Ruta: ${vehicle.route || 'N/A'}
        `)
                .addTo(this.map!);
            this.markers.push(marker);
        });

        // Ajustar vista para mostrar todos los vehículos (opcional)
        if (this.markers.length > 0) {
            const group = L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.2));
        }
    }
}