import type { Actor } from '../core/Actor';
import type { Task } from '../core/Task';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

export class FillDropdown implements Task {
  private constructor(
    private readonly containerSelector: string,
    private readonly optionText: string
  ) {}

  static select(optionText: string): { from: (containerSelector: string) => FillDropdown } {
    return {
      from: (containerSelector: string) => new FillDropdown(containerSelector, optionText),
    };
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    await page.locator(this.containerSelector).click();
    await page.locator(`.css-26l3qy-menu, [class*="menu"]`).getByText(this.optionText, { exact: true }).click();
  }
}
