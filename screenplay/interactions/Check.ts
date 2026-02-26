import type { Actor } from '../core/Actor';
import type { Interaction } from '../core/Interaction';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

export class Check implements Interaction {
  private constructor(private readonly selector: string) {}

  static on(selector: string): Check {
    return new Check(selector);
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    await page.locator(this.selector).check();
  }
}
