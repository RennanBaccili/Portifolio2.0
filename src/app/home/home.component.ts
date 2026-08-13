import { Component, ElementRef, HostListener, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../services/translation.service';
import { ProjectsService } from '../services/projects.service';
import { LanguageSelectorComponent } from '../components/language-selector/language-selector.component';
import { ButtonComponent, ButtonVariant, ButtonType } from '../components/button/button.component';
import { SkillCardComponent } from '../components/skill-card/skill-card.component';
import { HighlightCardComponent } from '../components/highlight-card/highlight-card.component';
import { TimelineItemComponent } from '../components/timeline-item/timeline-item.component';
import { ThemeToggleComponent } from '../components/theme-toggle/theme-toggle.component';
import { ProjectCardComponent } from '../components/project-card/project-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    LanguageSelectorComponent,
    ButtonComponent,
    SkillCardComponent,
    HighlightCardComponent,
    TimelineItemComponent,
    ThemeToggleComponent,
    ProjectCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  translationService = inject(TranslationService);
  t = this.translationService.t;
  projects = inject(ProjectsService).projects;
  scrollIndicatorVisible = signal(true);

  ButtonVariant = ButtonVariant;
  ButtonType = ButtonType;

  @ViewChild('projectsCarousel') projectsCarouselRef?: ElementRef<HTMLElement>;

  @HostListener('window:scroll')
  onWindowScroll() {
    this.scrollIndicatorVisible.set(window.scrollY < 80);
  }

  scrollProjects(direction: number): void {
    const el = this.projectsCarouselRef?.nativeElement;
    if (el) {
      const step = 340;
      el.scrollBy({ left: direction * step, behavior: 'smooth' });
    }
  }
}
