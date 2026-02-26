import type { Actor } from '../core/Actor';
import type { Interaction } from '../core/Interaction';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

export class Type implements Interaction {
  private constructor(
    private readonly selector: string,
    private readonly text: string
  ) {}

  static into(selector: string, text: string): Type {
    return new Type(selector, text);
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    await page.locator(this.selector).fill(this.text);
  }
}
