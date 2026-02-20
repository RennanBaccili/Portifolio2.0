import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'portfolio-theme';
  private platformId = inject(PLATFORM_ID);
  
  // Signal para o tema atual
  theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    // Aplicar tema inicial apenas no navegador
    if (isPlatformBrowser(this.platformId)) {
      this.applyTheme(this.theme());

      // Efeito para aplicar tema quando mudar e salvar no localStorage
      effect(() => {
        const currentTheme = this.theme();
        this.applyTheme(currentTheme);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.THEME_KEY, currentTheme);
        }
      });
    }
  }

  private getInitialTheme(): Theme {
    // Verificar localStorage apenas no navegador
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }

      // Verificar preferência do sistema
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }

    // Padrão: dark
    return 'light';
  }

  toggleTheme(): void {
    this.theme.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  private applyTheme(theme: Theme): void {
    if (isPlatformBrowser(this.platformId)) {
      const htmlElement = document.documentElement;
      htmlElement.classList.remove('light-theme', 'dark-theme');
      htmlElement.classList.add(`${theme}-theme`);
    }
  }

  isDark(): boolean {
    return this.theme() === 'dark';
  }

  isLight(): boolean {
    return this.theme() === 'light';
  }
}
