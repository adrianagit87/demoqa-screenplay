import { test, expect } from '../../fixtures/actor.fixture';
import { Navigate } from '../../screenplay/interactions/Navigate';
import { Click } from '../../screenplay/interactions/Click';
import { DragTo } from '../../screenplay/interactions/DragTo';
import { BrowseTheWeb } from '../../screenplay/abilities/BrowseTheWeb';

test.describe('Drag and Drop', () => {
  test('DRAG-001: drag element onto target shows "Dropped!" text', async ({ actor }) => {
    await actor.attemptsTo(Navigate.to('/droppable'));

    // page.waitForFunction() is a technical necessity — jQuery UI initialises the
    // droppable widget lazily; there is no CSS/DOM state we can poll with WaitFor
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    await page.waitForFunction(
      () => document.querySelector('#simpleDropContainer #droppable')?.classList.contains('ui-droppable'),
      { timeout: 10_000 }
    );

    await actor.attemptsTo(DragTo.element('#draggable').onto('#simpleDropContainer #droppable'));

    await expect(page.locator('#simpleDropContainer #droppable')).toContainText('Dropped!', { timeout: 8_000 });
  });

  test('DRAG-002: non-revert draggable stays at new position when dropped outside target', async ({ actor }) => {
    await actor.attemptsTo(
      Navigate.to('/droppable'),
      Click.on('[role="tab"]:has-text("Revert Draggable")'),
    );

    // Wait for jQuery UI to initialise the non-revert draggable widget
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    await page.waitForFunction(
      () => document.querySelector('#notRevertable')?.classList.contains('ui-draggable'),
      { timeout: 10_000 }
    );

    const draggable = page.locator('#notRevertable');
    const originalBox = await draggable.boundingBox();
    expect(originalBox).not.toBeNull();

    // Drag outside the droppable target — the element should stay at the new position
    await actor.attemptsTo(
      DragTo.element('#notRevertable').onto('[role="tab"]:has-text("Revert Draggable")'),
    );

    const newBox = await draggable.boundingBox();
    expect(newBox).not.toBeNull();
    expect(Math.abs(newBox!.x - originalBox!.x)).toBeGreaterThan(10);
  });
});
