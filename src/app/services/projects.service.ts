import { Injectable, Signal, computed, inject } from '@angular/core';
import { PROJECTS } from '../data/projects';
import { ProjectDefinition, ProjectLocaleContent } from '../data/project-content.model';
import { Language, TranslationService } from './translation.service';

/** Projeto ja resolvido para o idioma ativo — o que os componentes consomem. */
export interface LocalizedProject extends Omit<ProjectDefinition, 'content'> {
  content: ProjectLocaleContent;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private translation = inject(TranslationService);

  /** Todos os projetos no idioma ativo, na ordem do registry. */
  readonly projects: Signal<LocalizedProject[]> = computed(() => {
    const language = this.translation.language();
    return PROJECTS.map(project => localize(project, language));
  });
}

function localize(project: ProjectDefinition, language: Language): LocalizedProject {
  const { content, ...meta } = project;
  return { ...meta, content: content[language] };
}
