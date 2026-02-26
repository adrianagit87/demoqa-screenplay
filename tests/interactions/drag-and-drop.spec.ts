import { test, expect } from '../../fixtures/actor.fixture';
import { Navigate } from '../../screenplay/interactions/Navigate';
import { DragTo } from '../../screenplay/interactions/DragTo';
import { BrowseTheWeb } from '../../screenplay/abilities/BrowseTheWeb';

test.describe('Drag and Drop', () => {
  test('DRAG-001: drag element onto target shows "Dropped!" text', async ({ actor }) => {
    await actor.attemptsTo(Navigate.to('/droppable'));

    const page = actor.abilityTo(BrowseTheWeb).getPage();
    // The Simple tab is active by default; scope to the active tab pane to avoid strict mode violation
    // Wait for jQuery UI to fully initialize the droppable widget before dragging
    // (ui-droppable class is added lazily — dragging before init causes the drop event to not fire)
    await page.waitForFunction(
      () => document.querySelector('#simpleDropContainer #droppable')?.classList.contains('ui-droppable'),
      { timeout: 10_000 }
    );

    await actor.attemptsTo(DragTo.element('#draggable').onto('#simpleDropContainer #droppable'));

    await expect(page.locator('#simpleDropContainer #droppable')).toContainText('Dropped!', { timeout: 8_000 });
  });

  test('DRAG-002: revert draggable released outside target returns to origin', async ({ actor }) => {
    await actor.attemptsTo(Navigate.to('/droppable'));

    const page = actor.abilityTo(BrowseTheWeb).getPage();

    // Click the "Revert Draggable" tab
    await page.getByRole('tab', { name: /Revert Draggable/i }).click();
    await page.waitForTimeout(400);

    const draggable = page.locator('#revertable');
    await draggable.waitFor({ state: 'visible' });
    const originalBox = await draggable.boundingBox();

    if (originalBox) {
      const cx = originalBox.x + originalBox.width / 2;
      const cy = originalBox.y + originalBox.height / 2;
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      await page.mouse.move(cx + 300, cy - 100, { steps: 15 });
      await page.mouse.up();
    }

    // Wait for the revert animation to complete
    await page.waitForTimeout(1000);

    const newBox = await draggable.boundingBox();
    if (originalBox && newBox) {
      expect(Math.abs(newBox.x - originalBox.x)).toBeLessThan(10);
      expect(Math.abs(newBox.y - originalBox.y)).toBeLessThan(10);
    }
  });
});
