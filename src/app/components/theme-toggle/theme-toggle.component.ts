import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
  theme = this.themeService.theme;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  get isDark(): boolean {
    return this.theme() === 'dark';
  }

  get isLight(): boolean {
    return this.theme() === 'light';
  }
}
