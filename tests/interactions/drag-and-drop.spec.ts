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

    // Wait for jQuery UI to fully initialize the draggable widget before dragging
    await page.waitForFunction(
      () => document.querySelector('#revertable')?.classList.contains('ui-draggable'),
      { timeout: 10_000 }
    );

    const draggable = page.locator('#revertable');
    const originalBox = await draggable.boundingBox();
    expect(originalBox).not.toBeNull();

    // Use Playwright's dragTo API (same as DRAG-001) — more reliable than manual mouse
    // events for triggering jQuery UI's revert:invalid logic in headless CI.
    // Drop onto the tab button (not a ui-droppable) → triggers revert animation.
    await draggable.dragTo(page.getByRole('tab', { name: /Revert Draggable/i }));

    // Poll on the Node side using locator.boundingBox() which handles scroll correctly
    await expect(async () => {
      const newBox = await draggable.boundingBox();
      expect(newBox).not.toBeNull();
      expect(Math.abs(newBox!.x - originalBox!.x)).toBeLessThan(10);
      expect(Math.abs(newBox!.y - originalBox!.y)).toBeLessThan(10);
    }).toPass({ timeout: 5_000 });
  });
});
