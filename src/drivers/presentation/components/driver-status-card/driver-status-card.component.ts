import { DatePipe, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { DriverEntity } from '../../../domain/entities/driver.entity';

@Component({
  selector: 'kw-driver-status-card',
  standalone: true,
  imports: [DatePipe, NgClass, MatIconModule, TranslateModule],
  templateUrl: './driver-status-card.component.html',
  styleUrl: './driver-status-card.component.css'
})
export class DriverStatusCardComponent {
  @Input({ required: true }) driver!: DriverEntity;

  scoreGradient(value: number): string {
    const safeValue = Math.max(0, Math.min(value, 100));
    return `linear-gradient(90deg, var(--kw-blue-700), #25c4b7 ${safeValue}%, #e8f0f8 ${safeValue}%)`;
  }
}
