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

    const cx = originalBox!.x + originalBox!.width / 2;
    const cy = originalBox!.y + originalBox!.height / 2;

    await page.mouse.move(cx, cy);
    await page.mouse.down();
    // Drop at top-left corner — far from any droppable target
    await page.mouse.move(50, 50, { steps: 15 });
    await page.mouse.up();

    // Poll until the element reverts to its original position (avoids fixed timeout)
    await page.waitForFunction(
      (arg: { origX: number; origY: number }) => {
        const el = document.querySelector('#revertable') as HTMLElement | null;
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return Math.abs(rect.left - arg.origX) < 10 && Math.abs(rect.top - arg.origY) < 10;
      },
      { origX: originalBox!.x, origY: originalBox!.y },
      { timeout: 5_000 }
    );
  });
});
