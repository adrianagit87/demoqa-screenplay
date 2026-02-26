import type { Actor } from '../core/Actor';
import type { Interaction } from '../core/Interaction';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

export class DragTo implements Interaction {
  private constructor(
    private readonly sourceSelector: string,
    private readonly targetSelector: string
  ) {}

  static element(sourceSelector: string): { onto: (targetSelector: string) => DragTo } {
    return {
      onto: (targetSelector: string) => new DragTo(sourceSelector, targetSelector),
    };
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    // Use .first() to handle pages where multiple elements match the target selector
    await page.locator(this.sourceSelector).dragTo(page.locator(this.targetSelector).first());
  }
}
