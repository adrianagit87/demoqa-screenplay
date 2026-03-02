import type { Actor } from '../core/Actor';
import type { Task } from '../core/Task';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

export class ExpandTreeNode implements Task {
  private constructor(private readonly index: number) {}

  static root(): ExpandTreeNode {
    return new ExpandTreeNode(0);
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    await page.locator('.rc-tree-switcher').nth(this.index).click({ force: true });
    // Wait for the expand animation to settle before proceeding
    await page.locator('.rc-tree-switcher_open').waitFor({ state: 'visible' });
  }
}
