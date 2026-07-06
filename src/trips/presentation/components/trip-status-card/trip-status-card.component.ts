import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TripEntity } from '../../../domain/entities/trip.entity';

@Component({
  selector: 'kw-trip-status-card',
  standalone: true,
  imports: [NgClass, MatIconModule],
  templateUrl: './trip-status-card.component.html',
  styleUrl: './trip-status-card.component.css'
})
export class TripStatusCardComponent {
  @Input({ required: true }) trip!: TripEntity;
  @Output() viewTrip = new EventEmitter<TripEntity>();
  @Output() startTrip = new EventEmitter<TripEntity>();
  @Output() completeTrip = new EventEmitter<TripEntity>();
  @Output() cancelTrip = new EventEmitter<TripEntity>();

  occupancy(): number {
    return Math.round((this.trip.students / this.trip.capacity) * 100);
  }
}
