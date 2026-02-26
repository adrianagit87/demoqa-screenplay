import type { Actor } from '../core/Actor';
import type { Interaction } from '../core/Interaction';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

export class Select implements Interaction {
  private constructor(
    private readonly selector: string,
    private readonly value: string
  ) {}

  static option(value: string): { from: (selector: string) => Select } {
    return {
      from: (selector: string) => new Select(selector, value),
    };
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    await page.locator(this.selector).selectOption(this.value);
  }
}
