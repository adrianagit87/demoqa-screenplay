import type { Actor } from '../core/Actor';
import type { Task } from '../core/Task';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

export class EditTableRecord implements Task {
  private constructor(
    private readonly rowIdentifier: string,
    private readonly fieldId: string,
    private readonly newValue: string
  ) {}

  static inRowContaining(text: string): { update: (fieldId: string, value: string) => EditTableRecord } {
    return {
      update: (fieldId: string, value: string) => new EditTableRecord(text, fieldId, value),
    };
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    await page
      .locator('tr')
      .filter({ hasText: this.rowIdentifier })
      .locator('[title="Edit"]')
      .click({ force: true });
    const field = page.locator(`#${this.fieldId}`);
    await field.waitFor({ state: 'visible' });
    await field.clear();
    await field.fill(this.newValue);
    await page.locator('#submit').click({ force: true });
  }
}
