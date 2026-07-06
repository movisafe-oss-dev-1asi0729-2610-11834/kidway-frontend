import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SchoolRouteEntity } from '../../../domain/entities/school-route.entity';

@Component({
  selector: 'kw-route-map-panel',
  standalone: true,
  imports: [NgClass, MatIconModule],
  templateUrl: './route-map-panel.component.html',
  styleUrl: './route-map-panel.component.css'
})
export class RouteMapPanelComponent {
  @Input() routes: SchoolRouteEntity[] = [];
}
