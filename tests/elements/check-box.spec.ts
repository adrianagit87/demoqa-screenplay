import { test, expect } from '../../fixtures/actor.fixture';
import { Navigate } from '../../screenplay/interactions/Navigate';
import { Visibility } from '../../screenplay/questions/Visibility';
import { Text } from '../../screenplay/questions/Text';
import { BrowseTheWeb } from '../../screenplay/abilities/BrowseTheWeb';

test.describe('Check Box', () => {
  // DemoQA now uses rc-tree (not react-checkbox-tree)
  // Selectors: .rc-tree-switcher (expand toggle), .rc-tree-checkbox, .rc-tree-treenode

  test.beforeEach(async ({ actor }) => {
    await actor.attemptsTo(Navigate.to('/checkbox'));
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    await page.locator('.rc-tree').waitFor({ state: 'visible' });
  });

  test('CHECK-001: expand tree, check Documents, verify result shown', async ({ actor }) => {
    const page = actor.abilityTo(BrowseTheWeb).getPage();

    // Expand the root "Home" node
    await page.locator('.rc-tree-switcher').first().click({ force: true });
    await page.waitForTimeout(300);

    // Click the Documents node's checkbox (the node with title "Documents")
    const documentsNode = page.locator('.rc-tree-treenode').filter({ has: page.locator('.rc-tree-title', { hasText: 'Documents' }) });
    await documentsNode.locator('.rc-tree-checkbox').click({ force: true });

    const resultVisible = await actor.asks(Visibility.of('#result'));
    expect(resultVisible).toBe(true);

    const resultText = await actor.asks(Text.of('#result'));
    expect(resultText.toLowerCase()).toContain('documents');
  });

  test('CHECK-002: check Home (root) marks everything', async ({ actor }) => {
    const page = actor.abilityTo(BrowseTheWeb).getPage();

    // Click the root "Home" checkbox
    await page.locator('.rc-tree-checkbox').first().click({ force: true });

    const resultText = await actor.asks(Text.of('#result'));
    expect(resultText.toLowerCase()).toContain('home');
    expect(resultText.toLowerCase()).toContain('documents');
    expect(resultText.toLowerCase()).toContain('desktop');
  });

  test('CHECK-003: check then uncheck restores original state', async ({ actor }) => {
    const page = actor.abilityTo(BrowseTheWeb).getPage();

    // Check root
    await page.locator('.rc-tree-checkbox').first().click({ force: true });
    let resultVisible = await actor.asks(Visibility.of('#result'));
    expect(resultVisible).toBe(true);

    // Uncheck root
    await page.locator('.rc-tree-checkbox').first().click({ force: true });
    resultVisible = await actor.asks(Visibility.of('#result'));
    expect(resultVisible).toBe(false);
  });
});
