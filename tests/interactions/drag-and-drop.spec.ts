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

  test('DRAG-002: non-revert draggable stays at new position when dropped outside target', async ({ actor }) => {
    await actor.attemptsTo(Navigate.to('/droppable'));

    const page = actor.abilityTo(BrowseTheWeb).getPage();

    // Click the "Revert Draggable" tab
    await page.getByRole('tab', { name: /Revert Draggable/i }).click();

    // Wait for jQuery UI to initialize the non-revert draggable widget
    await page.waitForFunction(
      () => document.querySelector('#notRevertable')?.classList.contains('ui-draggable'),
      { timeout: 10_000 }
    );

    const draggable = page.locator('#notRevertable');
    const originalBox = await draggable.boundingBox();
    expect(originalBox).not.toBeNull();

    // Drag outside the droppable target — the non-revert draggable should STAY at new position
    await draggable.dragTo(page.getByRole('tab', { name: /Revert Draggable/i }));

    // Verify the element moved and stayed (did NOT revert to origin)
    const newBox = await draggable.boundingBox();
    expect(newBox).not.toBeNull();
    expect(Math.abs(newBox!.x - originalBox!.x)).toBeGreaterThan(10);
  });
});
