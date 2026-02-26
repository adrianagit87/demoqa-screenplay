import type { Actor } from '../core/Actor';
import type { Question } from '../core/Question';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

export class Visibility implements Question<boolean> {
  private constructor(private readonly selector: string) {}

  static of(selector: string): Visibility {
    return new Visibility(selector);
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    return page.locator(this.selector).isVisible();
  }
}
