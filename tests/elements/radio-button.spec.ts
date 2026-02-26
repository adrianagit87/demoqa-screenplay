import { test, expect } from '../../fixtures/actor.fixture';
import { Navigate } from '../../screenplay/interactions/Navigate';
import { Visibility } from '../../screenplay/questions/Visibility';
import { Text } from '../../screenplay/questions/Text';
import { BrowseTheWeb } from '../../screenplay/abilities/BrowseTheWeb';

test.describe('Radio Button', () => {
  test.beforeEach(async ({ actor }) => {
    await actor.attemptsTo(Navigate.to('/radio-button'));
  });

  test('RADIO-001: clicking Yes displays "You have selected Yes"', async ({ actor }) => {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    // Click label for Yes radio (the radio itself is hidden)
    await page.locator('label[for="yesRadio"]').click();

    const successVisible = await actor.asks(Visibility.of('.mt-3'));
    expect(successVisible).toBe(true);

    const text = await actor.asks(Text.of('.mt-3'));
    expect(text).toContain('Yes');
  });

  test('RADIO-002: clicking Impressive displays correct confirmation text', async ({ actor }) => {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    await page.locator('label[for="impressiveRadio"]').click();

    const successVisible = await actor.asks(Visibility.of('.mt-3'));
    expect(successVisible).toBe(true);

    const text = await actor.asks(Text.of('.mt-3'));
    expect(text).toContain('Impressive');
  });
});
