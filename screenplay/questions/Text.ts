import type { Actor } from '../core/Actor';
import type { Question } from '../core/Question';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

export class Text implements Question<string> {
  private constructor(private readonly selector: string) {}

  static of(selector: string): Text {
    return new Text(selector);
  }

  async answeredBy(actor: Actor): Promise<string> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    return (await page.locator(this.selector).textContent()) ?? '';
  }
}
