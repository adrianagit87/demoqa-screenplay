import type { Actor } from '../core/Actor';
import type { Interaction } from '../core/Interaction';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

export class WaitFor implements Interaction {
  private constructor(
    private readonly selector: string,
    private readonly state: 'visible' | 'hidden' | 'attached' | 'detached' = 'visible'
  ) {}

  static visibility(selector: string): WaitFor {
    return new WaitFor(selector, 'visible');
  }

  static hidden(selector: string): WaitFor {
    return new WaitFor(selector, 'hidden');
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    await page.locator(this.selector).waitFor({ state: this.state });
  }
}
