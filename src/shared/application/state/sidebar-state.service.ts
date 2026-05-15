import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarStateService {
  readonly collapsed = signal(false);
  readonly mobileOpen = signal(false);

  toggle(): void {
    if (window.innerWidth <= 900) {
      this.mobileOpen.update((value) => !value);
      return;
    }
    this.collapsed.update((value) => !value);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }
}
