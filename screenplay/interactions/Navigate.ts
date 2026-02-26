import type { Actor } from '../core/Actor';
import type { Interaction } from '../core/Interaction';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

export class Navigate implements Interaction {
  private constructor(private readonly url: string) {}

  static to(url: string): Navigate {
    return new Navigate(url);
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    await page.goto(this.url);
  }
}
