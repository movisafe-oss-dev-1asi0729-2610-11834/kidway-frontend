import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationService } from '../../../application/services/navigation.service';
import { AuthService } from '../../../../identity-access/application/services/auth.service';
import { SidebarStateService } from '../../../application/state/sidebar-state.service';

@Component({
  selector: 'kw-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule, MatIconModule, MatButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  protected readonly navigation = inject(NavigationService);
  protected readonly sidebarState = inject(SidebarStateService);
  protected readonly auth = inject(AuthService);
}
