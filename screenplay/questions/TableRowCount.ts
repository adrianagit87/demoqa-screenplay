import type { Actor } from '../core/Actor';
import type { Question } from '../core/Question';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

export class TableRowCount implements Question<number> {
  private constructor(private readonly tableSelector: string) {}

  static in(tableSelector: string): TableRowCount {
    return new TableRowCount(tableSelector);
  }

  async answeredBy(actor: Actor): Promise<number> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    return page.locator(`${this.tableSelector} tbody tr`).count();
  }
}
