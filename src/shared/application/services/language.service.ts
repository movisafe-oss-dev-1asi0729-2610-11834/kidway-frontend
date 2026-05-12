import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  readonly supportedLanguages = ['en', 'es'] as const;

  initialize(): void {
    const savedLanguage = localStorage.getItem('kidway-language') ?? 'en';
    this.translate.addLangs([...this.supportedLanguages]);
    this.translate.setDefaultLang('en');
    this.use(savedLanguage === 'es' ? 'es' : 'en');
  }

  use(language: 'en' | 'es'): void {
    localStorage.setItem('kidway-language', language);
    document.documentElement.lang = language;
    this.translate.use(language);
  }

  current(): 'en' | 'es' {
    return (this.translate.currentLang || this.translate.defaultLang || 'en') as 'en' | 'es';
  }
}
