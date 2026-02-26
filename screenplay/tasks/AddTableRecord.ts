import type { Actor } from '../core/Actor';
import type { Task } from '../core/Task';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

interface TableRecord {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  salary: string;
  department: string;
}

export class AddTableRecord implements Task {
  private constructor(private readonly record: TableRecord) {}

  static with(record: TableRecord): AddTableRecord {
    return new AddTableRecord(record);
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    await page.locator('#addNewRecordButton').click();
    await page.locator('#registration-form-modal').waitFor({ state: 'visible' });
    await page.locator('#firstName').fill(this.record.firstName);
    await page.locator('#lastName').fill(this.record.lastName);
    await page.locator('#userEmail').fill(this.record.email);
    await page.locator('#age').fill(this.record.age);
    await page.locator('#salary').fill(this.record.salary);
    await page.locator('#department').fill(this.record.department);
    await page.locator('#submit').scrollIntoViewIfNeeded();
    await page.locator('#submit').click();
  }
}
