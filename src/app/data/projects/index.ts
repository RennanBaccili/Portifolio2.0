import { ProjectDefinition } from '../project-content.model';
import { VIGILIA } from './vigilia';
import { REDE_BRASIL } from './rede-brasil';
import { TRENDERTOK } from './trendertok';
import { LIFEPLUS } from './lifeplus';

/**
 * Ordem de exibicao no carrossel da home e nas rotas /projects/:id.
 * Do mais denso tecnicamente para o mais antigo.
 */
export const PROJECTS: ProjectDefinition[] = [VIGILIA, REDE_BRASIL, TRENDERTOK, LIFEPLUS];
