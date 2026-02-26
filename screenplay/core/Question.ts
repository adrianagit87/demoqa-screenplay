import type { Actor } from './Actor';

export interface Question<T> {
  answeredBy(actor: Actor): Promise<T>;
}
