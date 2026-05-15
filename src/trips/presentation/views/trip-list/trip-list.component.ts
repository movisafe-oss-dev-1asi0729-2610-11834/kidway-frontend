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
      <h2>{{ 'trips.title' | translate }}</h2>
      
      <div class="trip-table-wrapper">
        <table class="trip-table">
          <thead>
            <tr>
              <th>{{ 'trips.driver' | translate }}</th>
              <th>{{ 'trips.plate' | translate }}</th>
              <th>{{ 'trips.status' | translate }}</th>
              <th>{{ 'trips.actions' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            @for (trip of trips; track trip.id) {
              <tr>
                <td>{{ trip.driverName }}</td>
                <td>{{ trip.vehiclePlate }}</td>
                <td>
                  <span class="status-pill" [ngClass]="trip.status">
                    {{ 'trips.status_' + trip.status | translate }}
                  </span>
                </td>
                <td>
                  @if (trip.status === 'scheduled') {
                    <button class="btn start" (click)="handleStart(trip.id)">{{ 'trips.start' | translate }}</button>
                  } @else if (trip.status === 'on-progress') {
                    <button class="btn finish" (click)="handleFinish(trip.id)">{{ 'trips.finish' | translate }}</button>
                  } @else {
                    <span>{{ 'trips.no_actions' | translate }}</span>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
styles: [`
  .trips-container { padding: 20px; }`]
})
export class TripListComponent implements OnInit {
  trips: Trip[] = [];

  constructor(private tripService: TripService) {}

  ngOnInit() { this.loadTrips(); }

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