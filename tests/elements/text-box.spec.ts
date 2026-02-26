import { test, expect } from '../../fixtures/actor.fixture';
import { Navigate } from '../../screenplay/interactions/Navigate';
import { Click } from '../../screenplay/interactions/Click';
import { FillTextBox } from '../../screenplay/tasks/FillTextBox';
import { Visibility } from '../../screenplay/questions/Visibility';
import { Text } from '../../screenplay/questions/Text';
import { textBoxData } from '../../test-data/form-data';

test.describe('Text Box', () => {
  test.beforeEach(async ({ actor }) => {
    await actor.attemptsTo(Navigate.to('/text-box'));
  });

  test('TEXT-001: fill all fields and verify output is displayed', async ({ actor }) => {
    await actor.attemptsTo(
      FillTextBox.with(textBoxData),
      Click.on('#submit')
    );

    const nameVisible = await actor.asks(Visibility.of('#name'));
    const emailVisible = await actor.asks(Visibility.of('#email'));
    expect(nameVisible).toBe(true);
    expect(emailVisible).toBe(true);

    const nameText = await actor.asks(Text.of('#name'));
    expect(nameText).toContain(textBoxData.fullName);
  });

  test('TEXT-002: fill only full name and verify only that field appears in output', async ({ actor }) => {
    await actor.attemptsTo(
      FillTextBox.with({ fullName: textBoxData.fullName }),
      Click.on('#submit')
    );

    const nameVisible = await actor.asks(Visibility.of('#name'));
    expect(nameVisible).toBe(true);

    const emailVisible = await actor.asks(Visibility.of('#email'));
    expect(emailVisible).toBe(false);
  });

  test('TEXT-003: invalid email does not produce output block', async ({ actor }) => {
    await actor.attemptsTo(
      FillTextBox.with({ fullName: 'Test User', email: 'not-an-email' }),
      Click.on('#submit')
    );

    // With invalid email the output section should not appear
    const outputVisible = await actor.asks(Visibility.of('#output'));
    expect(outputVisible).toBe(false);
  });
});
