import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService, Language } from '../../services/translation.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.css'
})
export class LanguageSelectorComponent {
  translationService = inject(TranslationService);
  currentLanguage = this.translationService.language;

  selectLanguage(lang: Language): void {
    this.translationService.setLanguage(lang);
  }
}
