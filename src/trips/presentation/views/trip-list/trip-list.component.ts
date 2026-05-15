import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TripService } from '../../../application/services/trip.service';
import { Trip } from '../../../domain/models/trip.model';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="trips-container">
      <div class="header-section">
        <h2>{{ 'trips.title' | translate }}</h2>
      </div>

      <div class="trip-grid">
        @for (trip of trips; track trip.id) {
          <div class="trip-card">
            <div class="card-top">
              <div class="driver-info">
                <div class="avatar">{{ trip.driverName[0] }}</div>
                <div>
                  <strong class="driver-name">{{ trip.driverName }}</strong>
                  <div class="plate-badge">{{ trip.vehiclePlate }}</div>
                </div>
              </div>
              <span class="status-pill" [ngClass]="trip.status">
                ● {{ 'trips.status_' + trip.status | translate }}
              </span>
            </div>

            <div class="progress-bar">
              <div class="progress-fill" [ngClass]="trip.status"></div>
            </div>

            <div class="stats-row">
              <div class="stat">
                <span>{{ 'trips.start_time' | translate }}</span>
                <span>{{ trip.startTime ? (trip.startTime | date:'HH:mm') : '--:--' }}</span>
              </div>
              <div class="stat">
                <span>{{ 'trips.avg_speed' | translate }}</span>
                <span>45 km/h</span>
              </div>
            </div>

            @if (trip.status === 'scheduled') {
              <button class="btn-action start" (click)="handleStart(trip.id)">
                🚀 {{ 'trips.start' | translate }}
              </button>
            } @else if (trip.status === 'on-progress') {
              <button class="btn-action finish" (click)="handleFinish(trip.id)">
                🏁 {{ 'trips.finish' | translate }}
              </button>
            } @else {
              <div class="completed-msg">✅ {{ 'trips.status_completed' | translate }}</div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .trips-container { padding: 2rem; background: #f4f7fe; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; }
    .header-section { margin-bottom: 2rem; }
    .header-section h2 { color: #1b254b; font-size: 1.8rem; font-weight: 700; }
    .trip-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
    
    .trip-card {
      background: white; border-radius: 20px; padding: 1.5rem;
      box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.05); transition: transform 0.3s ease;
      border: 1px solid #e2e8f0; position: relative;
    }
    .trip-card:hover { transform: translateY(-5px); }

    .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .driver-info { display: flex; align-items: center; gap: 12px; }
    .driver-name { display: block; color: #1b254b; font-size: 1rem; }
    
    .avatar { 
      width: 45px; height: 45px; background: #4318ff; color: white; 
      border-radius: 12px; display: flex; align-items: center; 
      justify-content: center; font-weight: 800; font-size: 1.2rem;
    }

    .plate-badge { 
      background: #f4f7fe; padding: 2px 8px; border-radius: 6px; 
      font-family: 'Courier New', monospace; font-size: 0.8rem; 
      font-weight: 700; color: #4a5568; margin-top: 4px;
    }

    .status-pill { font-size: 0.75rem; font-weight: 700; padding: 4px 12px; border-radius: 20px; }
    .status-pill.scheduled { background: #eee; color: #777; }
    .status-pill.on-progress { background: #eef0ff; color: #4318ff; }
    .status-pill.completed { background: #e6fff5; color: #05cd99; }

    .progress-bar { height: 8px; background: #f4f7fe; border-radius: 10px; margin: 1.5rem 0; overflow: hidden; }
    .progress-fill { height: 100%; width: 0%; transition: width 1s ease; }
    .progress-fill.on-progress { width: 65%; background: linear-gradient(90deg, #4318ff, #b09eff); }
    .progress-fill.completed { width: 100%; background: #05cd99; }

    .stats-row { display: flex; justify-content: space-between; margin-bottom: 1.5rem; }
    .stat { display: flex; flex-direction: column; }
    .stat span:first-child { font-size: 0.7rem; color: #a3aed0; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat span:last-child { font-weight: 700; color: #1b254b; font-size: 0.95rem; }

    .btn-action {
      width: 100%; padding: 14px; border: none; border-radius: 16px; 
      font-weight: 700; cursor: pointer; transition: all 0.3s; color: white;
    }
    .btn-action.start { background: #4318ff; box-shadow: 0px 4px 14px rgba(67, 24, 255, 0.3); }
    .btn-action.finish { background: #ee5d50; box-shadow: 0px 4px 14px rgba(238, 93, 80, 0.2); }
    .btn-action:hover { filter: brightness(1.1); }
    
    .completed-msg { text-align: center; color: #05cd99; font-weight: 700; padding: 10px; }
  `]
})
export class TripListComponent implements OnInit {
  trips: Trip[] = [];

  constructor(private tripService: TripService) {}

  ngOnInit() {
    this.loadTrips();
  }

  loadTrips() {
    this.tripService.fetchTrips().subscribe(data => this.trips = data);
  }

  handleStart(id: number) {
    this.tripService.startTrip(id).subscribe(() => this.loadTrips());
  }

  handleFinish(id: number) {
    this.tripService.finishTrip(id).subscribe(() => this.loadTrips());
  }
}