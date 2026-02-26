import { test, expect } from '../../fixtures/actor.fixture';
import { Navigate } from '../../screenplay/interactions/Navigate';
import { BrowseTheWeb } from '../../screenplay/abilities/BrowseTheWeb';
import { tableRecord } from '../../test-data/form-data';

test.describe('Web Tables', () => {
  // DemoQA now uses a native <table> element, not react-table v6
  // Rows: <tr> — Action buttons: span[title="Edit"] / span[title="Delete"]

  test.beforeEach(async ({ actor }) => {
    await actor.attemptsTo(Navigate.to('/webtables'));
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    await page.locator('table').waitFor({ state: 'visible' });
  });

  test('TABLE-001: add new row and verify it appears in the table', async ({ actor }) => {
    const page = actor.abilityTo(BrowseTheWeb).getPage();

    await page.locator('#addNewRecordButton').click({ force: true });
    await page.locator('.modal.show').waitFor({ state: 'visible' });

    await page.locator('#firstName').fill(tableRecord.firstName);
    await page.locator('#lastName').fill(tableRecord.lastName);
    await page.locator('#userEmail').fill(tableRecord.email);
    await page.locator('#age').fill(tableRecord.age);
    await page.locator('#salary').fill(tableRecord.salary);
    await page.locator('#department').fill(tableRecord.department);
    await page.locator('#submit').click({ force: true });

    const newRow = page.locator('tr').filter({ hasText: tableRecord.firstName });
    await expect(newRow).toBeVisible({ timeout: 10_000 });
    await expect(newRow).toContainText(tableRecord.email);
  });

  test('TABLE-002: edit existing row and verify updated data', async ({ actor }) => {
    const page = actor.abilityTo(BrowseTheWeb).getPage();

    // Click the Edit button in Cierra's row
    const cierraRow = page.locator('tr').filter({ hasText: 'Cierra' });
    await cierraRow.locator('[title="Edit"]').click({ force: true });

    await page.locator('#salary').waitFor({ state: 'visible' });
    await page.locator('#salary').clear();
    await page.locator('#salary').fill('99999');
    await page.locator('#submit').click({ force: true });

    await expect(page.locator('tr').filter({ hasText: 'Cierra' })).toContainText('99999');
  });

  test('TABLE-003: delete a row and verify it disappears from the table', async ({ actor }) => {
    const page = actor.abilityTo(BrowseTheWeb).getPage();

    // Count data rows before (skip header row)
    const rowsBefore = await page.locator('tbody tr').count();

    // Click the Delete button in Cierra's row
    const cierraRow = page.locator('tr').filter({ hasText: 'Cierra' });
    await cierraRow.locator('[title="Delete"]').click({ force: true });

    await expect(page.locator('tr').filter({ hasText: 'Cierra' })).toHaveCount(0, { timeout: 10_000 });
    const rowsAfter = await page.locator('tbody tr').count();
    expect(rowsAfter).toBeLessThan(rowsBefore);
  });
});
