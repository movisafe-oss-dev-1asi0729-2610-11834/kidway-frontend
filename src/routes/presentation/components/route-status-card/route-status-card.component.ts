import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { SchoolRouteEntity } from '../../../domain/entities/school-route.entity';

@Component({
  selector: 'kw-route-status-card',
  standalone: true,
  imports: [NgClass, MatIconModule, TranslateModule],
  templateUrl: './route-status-card.component.html',
  styleUrl: './route-status-card.component.css'
})
export class RouteStatusCardComponent {
  @Input({ required: true }) route!: SchoolRouteEntity;

  capacityUsage(): number {
    if (!this.route.vehicleCapacity) return 0;
    return Math.min(100, Math.round((this.route.assignedStudents / this.route.vehicleCapacity) * 100));
  }

  statusLabel(): string {
    const labels: Record<string, string> = {
      active: 'Active',
      scheduled: 'Scheduled',
      review: 'Review',
      inactive: 'Inactive'
    };
    return labels[this.route.status] ?? this.route.status;
  }
}
