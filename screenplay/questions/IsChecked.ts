import type { Actor } from '../core/Actor';
import type { Question } from '../core/Question';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

export class IsChecked implements Question<boolean> {
  private constructor(private readonly selector: string) {}

  static for(selector: string): IsChecked {
    return new IsChecked(selector);
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    return page.locator(this.selector).isChecked();
  }
}
