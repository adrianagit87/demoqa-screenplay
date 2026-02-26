import type { Actor } from '../core/Actor';
import type { Interaction } from '../core/Interaction';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

export class Click implements Interaction {
  private constructor(
    private readonly selector: string,
    private readonly force: boolean = false
  ) {}

  static on(selector: string): Click {
    return new Click(selector);
  }

  /** Bypasses actionability checks — use when an ad overlay covers the element */
  static forced(selector: string): Click {
    return new Click(selector, true);
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    await page.locator(this.selector).click({ force: this.force });
  }
}
