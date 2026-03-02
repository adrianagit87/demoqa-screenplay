import { test, expect } from '../../fixtures/actor.fixture';
import { Navigate } from '../../screenplay/interactions/Navigate';
import { WaitFor } from '../../screenplay/interactions/WaitFor';
import { AddTableRecord } from '../../screenplay/tasks/AddTableRecord';
import { EditTableRecord } from '../../screenplay/tasks/EditTableRecord';
import { DeleteTableRecord } from '../../screenplay/tasks/DeleteTableRecord';
import { TableRowCount } from '../../screenplay/questions/TableRowCount';
import { BrowseTheWeb } from '../../screenplay/abilities/BrowseTheWeb';
import { tableRecord } from '../../test-data/form-data';

test.describe('Web Tables', () => {
  test.beforeEach(async ({ actor }) => {
    await actor.attemptsTo(
      Navigate.to('/webtables'),
      WaitFor.visibility('table'),
    );
  });

  test('TABLE-001: add new row and verify it appears in the table', async ({ actor }) => {
    await actor.attemptsTo(AddTableRecord.with(tableRecord));

    // expect() with locator filter is used for assertions that require chained locators
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    await expect(page.locator('tr').filter({ hasText: tableRecord.firstName })).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('tr').filter({ hasText: tableRecord.firstName })).toContainText(tableRecord.email);
  });

  test('TABLE-002: edit existing row and verify updated data', async ({ actor }) => {
    await actor.attemptsTo(
      EditTableRecord.inRowContaining('Cierra').update('salary', '99999'),
    );

    const page = actor.abilityTo(BrowseTheWeb).getPage();
    await expect(page.locator('tr').filter({ hasText: 'Cierra' })).toContainText('99999');
  });

  test('TABLE-003: delete a row and verify it disappears from the table', async ({ actor }) => {
    const rowsBefore = await actor.asks(TableRowCount.in('table'));

    await actor.attemptsTo(DeleteTableRecord.inRowContaining('Cierra'));

    const page = actor.abilityTo(BrowseTheWeb).getPage();
    await expect(page.locator('tr').filter({ hasText: 'Cierra' })).toHaveCount(0, { timeout: 10_000 });
    const rowsAfter = await actor.asks(TableRowCount.in('table'));
    expect(rowsAfter).toBeLessThan(rowsBefore);
  });
});
