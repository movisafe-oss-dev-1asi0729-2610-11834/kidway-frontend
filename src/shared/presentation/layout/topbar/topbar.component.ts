import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LanguageService } from '../../../application/services/language.service';
import { SidebarStateService } from '../../../application/state/sidebar-state.service';

@Component({
  selector: 'kw-topbar',
  standalone: true,
  imports: [RouterLink, TranslateModule, MatIconModule, MatButtonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  protected readonly sidebarState = inject(SidebarStateService);
  protected readonly languageService = inject(LanguageService);
  protected readonly darkMode = signal(false);

  setLanguage(language: 'en' | 'es'): void { this.languageService.use(language); }
  toggleTheme(): void {
    this.darkMode.update((value) => !value);
    document.body.classList.toggle('dark-theme', this.darkMode());
  }
}
