import type { Actor } from '../core/Actor';
import type { Task } from '../core/Task';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

export class CheckTreeNode implements Task {
  private constructor(private readonly nodeName: string) {}

  static named(nodeName: string): CheckTreeNode {
    return new CheckTreeNode(nodeName);
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    const node = page
      .locator('.rc-tree-treenode')
      .filter({ has: page.locator('.rc-tree-title', { hasText: this.nodeName }) });
    await node.locator('.rc-tree-checkbox').click({ force: true });
  }
}
