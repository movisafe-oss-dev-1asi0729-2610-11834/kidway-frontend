import { Component, computed, inject } from '@angular/core';
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

  protected readonly currentRole = 'Company Admin';

  protected readonly visibleModules = computed(() =>
    this.navigation.items.filter((item) => !item.roles || item.roles.includes(this.currentRole))
  );

  protected readonly indicators = [
    { icon: 'route', labelKey: 'home.trips', value: '12', helper: 'In progress today' },
    { icon: 'school', labelKey: 'home.students', value: '184', helper: 'Morning service' },
    { icon: 'notifications', labelKey: 'home.alerts', value: '4', helper: 'Requires attention' },
    { icon: 'apps', labelKey: 'home.modules', value: '13', helper: 'Enabled for role' }
  ];

  protected readonly nextActions = [
    { icon: 'assignment_late', tone: 'warning', title: 'Review pending assignments', text: 'Validate route and pickup data before daily dispatch.', route: '/app/assignments' },
    { icon: 'report_problem', tone: 'danger', title: 'Check active incidents', text: 'One incident still requires operational follow-up.', route: '/app/incidents' },
    { icon: 'analytics', tone: 'success', title: 'Open service analytics', text: 'Monitor current quality, incidents and route performance.', route: '/app/analytics' }
  ];
}
