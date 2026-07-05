import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { VehicleEntity } from '../../../domain/entities/vehicle.entity';

@Component({
  selector: 'kw-vehicle-status-card',
  standalone: true,
  imports: [NgClass, MatIconModule, TranslateModule],
  templateUrl: './vehicle-status-card.component.html',
  styleUrl: './vehicle-status-card.component.css'
})
export class VehicleStatusCardComponent {
  @Input({ required: true }) vehicle!: VehicleEntity;

  capacityUsage(vehicle: VehicleEntity): number {
    if (!vehicle.capacity) return 0;
    return Math.min(Math.round((vehicle.assignedStudents / vehicle.capacity) * 100), 100);
  }
}
