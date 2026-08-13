import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren,
  computed,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { ProjectsService } from '../../services/projects.service';
import { ThemeService } from '../../services/theme.service';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';
import { LanguageSelectorComponent } from '../../components/language-selector/language-selector.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ThemeToggleComponent, LanguageSelectorComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private translation = inject(TranslationService);
  private projects = inject(ProjectsService);
  private theme = inject(ThemeService);

  @ViewChildren('flowSlide') private flowSlides!: QueryList<ElementRef<HTMLElement>>;
  private intersectionObserver?: IntersectionObserver;
  private slidesSubscription?: Subscription;

  projectId = signal<string | null>(null);
  fullscreenImageSrc = signal<string | null>(null);

  t = this.translation.t;

  /** Projeto da rota resolvido no idioma ativo, ou null quando o id nao existe. */
  project = computed(
    () => this.projects.projects().find(project => project.id === this.projectId()) ?? null
  );

  content = computed(() => this.project()?.content ?? null);

  /**
   * Os diagramas sao renderizados em duas variantes pelo tools/render-puml.py,
   * entao o caminho final depende do tema ativo.
   */
  diagramSrc(basePath: string): string {
    return `${basePath}-${this.theme.theme()}.svg`;
  }

  openImageFullscreen(src: string): void {
    this.fullscreenImageSrc.set(src);
  }

  closeFullscreen(): void {
    this.fullscreenImageSrc.set(null);
  }

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.projectId.set(params.get('id'));
    });
  }

  ngAfterViewInit(): void {
    this.observeSlides();
    // O conteudo depende do idioma e da rota, entao a lista de slides
    // pode ser recriada depois do primeiro render.
    this.slidesSubscription = this.flowSlides.changes.subscribe(() => this.observeSlides());
  }

  private observeSlides(): void {
    if (!this.flowSlides || this.flowSlides.length === 0) {
      return;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      this.flowSlides.forEach(slide => {
        slide.nativeElement.classList.add('project-flow__slide--visible');
      });
      return;
    }

    this.intersectionObserver ??= new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            element.classList.add('project-flow__slide--visible');
            this.intersectionObserver?.unobserve(element);
          }
        });
      },
      {
        threshold: 0.3
      }
    );

    this.flowSlides.forEach(slide => {
      if (!slide.nativeElement.classList.contains('project-flow__slide--visible')) {
        this.intersectionObserver?.observe(slide.nativeElement);
      }
    });
  }

  ngOnDestroy(): void {
    this.slidesSubscription?.unsubscribe();
    this.intersectionObserver?.disconnect();
  }
}
