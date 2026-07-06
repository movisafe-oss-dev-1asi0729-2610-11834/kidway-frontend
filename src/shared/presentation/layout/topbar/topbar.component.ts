import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { LanguageService } from '../../../application/services/language.service';
import { SidebarStateService } from '../../../application/state/sidebar-state.service';
import { NotificationService } from '../../../../notifications/application/services/notification.service';
import { NotificationItem } from '../../../../notifications/domain/models/notification.model';
import { AuthService } from '../../../../identity-access/application/services/auth.service';

@Component({
  selector: 'kw-topbar',
  standalone: true,
  imports: [RouterLink, NgClass, TranslateModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  protected readonly sidebarState = inject(SidebarStateService);
  protected readonly languageService = inject(LanguageService);
  protected readonly notificationService = inject(NotificationService);
  protected readonly auth = inject(AuthService);
  protected readonly darkMode = signal(false);


  constructor() {
    this.notificationService.load();
  }

  protected canAccessBilling(): boolean {
    return this.auth.canAccessBilling();
  }

  setLanguage(language: 'en' | 'es'): void { this.languageService.use(language); }
  toggleTheme(): void {
    this.darkMode.update((value) => !value);
    document.body.classList.toggle('dark-theme', this.darkMode());
  }

  protected markAsRead(item: NotificationItem, event: Event): void {
    event.stopPropagation();
    this.notificationService.markAsRead(item.id);
  }
}
