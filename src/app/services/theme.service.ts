import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'rbac_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal<boolean>(true);

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const preferDark = saved !== null ? saved === 'dark' : true;
    this.isDark.set(preferDark);
    this.applyTheme(preferDark);
  }

  toggle() {
    const next = !this.isDark();
    this.isDark.set(next);
    this.applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
  }

  private applyTheme(dark: boolean) {
    const root = document.documentElement;
    if (dark) {
      root.classList.remove('light-mode');
    } else {
      root.classList.add('light-mode');
    }
  }
}
