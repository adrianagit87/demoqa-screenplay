import type { Actor } from '../core/Actor';
import type { Task } from '../core/Task';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

export class DeleteTableRecord implements Task {
  private constructor(private readonly rowIdentifier: string) {}

  static inRowContaining(text: string): DeleteTableRecord {
    return new DeleteTableRecord(text);
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    await page
      .locator('tr')
      .filter({ hasText: this.rowIdentifier })
      .locator('[title="Delete"]')
      .click({ force: true });
  }
}
