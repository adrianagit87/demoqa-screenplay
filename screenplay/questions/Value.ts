import type { Actor } from '../core/Actor';
import type { Question } from '../core/Question';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

export class Value implements Question<string> {
  private constructor(private readonly selector: string) {}

  static of(selector: string): Value {
    return new Value(selector);
  }

  async answeredBy(actor: Actor): Promise<string> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    return page.locator(this.selector).inputValue();
  }
}
