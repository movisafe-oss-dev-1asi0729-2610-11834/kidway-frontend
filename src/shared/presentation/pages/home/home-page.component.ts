import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationService } from '../../../application/services/navigation.service';

@Component({
  selector: 'kw-home-page',
  standalone: true,
  imports: [RouterLink, TranslateModule, MatIconModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  protected readonly navigation = inject(NavigationService);
  protected readonly alerts = [
    { tone: 'danger', title: 'Route delay detected', text: 'Vehicle KW-204 is 8 minutes behind schedule.' },
    { tone: 'warning', title: 'Attendance pending', text: 'Three students still require boarding confirmation.' },
    { tone: 'success', title: 'Report ready', text: 'Daily fleet and attendance summary is available.' }
  ];
}
