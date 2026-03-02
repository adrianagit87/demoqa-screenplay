import { test, expect } from '../../fixtures/actor.fixture';
import { Navigate } from '../../screenplay/interactions/Navigate';
import { Click } from '../../screenplay/interactions/Click';
import { Visibility } from '../../screenplay/questions/Visibility';
import { Text } from '../../screenplay/questions/Text';

test.describe('Radio Button', () => {
  test.beforeEach(async ({ actor }) => {
    await actor.attemptsTo(Navigate.to('/radio-button'));
  });

  test('RADIO-001: clicking Yes displays "You have selected Yes"', async ({ actor }) => {
    await actor.attemptsTo(Click.on('label[for="yesRadio"]'));

    const successVisible = await actor.asks(Visibility.of('.mt-3'));
    expect(successVisible).toBe(true);

    const text = await actor.asks(Text.of('.mt-3'));
    expect(text).toContain('Yes');
  });

  test('RADIO-002: clicking Impressive displays correct confirmation text', async ({ actor }) => {
    await actor.attemptsTo(Click.on('label[for="impressiveRadio"]'));

    const successVisible = await actor.asks(Visibility.of('.mt-3'));
    expect(successVisible).toBe(true);

    const text = await actor.asks(Text.of('.mt-3'));
    expect(text).toContain('Impressive');
  });
});
