import type { Actor } from '../core/Actor';
import type { Task } from '../core/Task';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

export class FillDatePicker implements Task {
  private constructor(
    private readonly selector: string,
    private readonly date: string
  ) {}

  static in(selector: string): { withDate: (date: string) => FillDatePicker } {
    return {
      withDate: (date: string) => new FillDatePicker(selector, date),
    };
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    await page.locator(this.selector).fill(this.date);
    await page.keyboard.press('Tab');
  }
}
