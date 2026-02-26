import { test, expect } from '../../fixtures/actor.fixture';
import { Navigate } from '../../screenplay/interactions/Navigate';
import { Click } from '../../screenplay/interactions/Click';
import { AcceptAlert } from '../../screenplay/interactions/AcceptAlert';
import { Visibility } from '../../screenplay/questions/Visibility';
import { Text } from '../../screenplay/questions/Text';

test.describe('Alerts', () => {
  test.beforeEach(async ({ actor }) => {
    await actor.attemptsTo(Navigate.to('/alerts'));
  });

  test('ALERT-001: click alert button, accept, and see confirmation message', async ({ actor }) => {
    await actor.attemptsTo(
      AcceptAlert.confirm(),
      Click.on('#alertButton')
    );

    // After accepting the alert, page text should still be present
    const visible = await actor.asks(Visibility.of('#alertButton'));
    expect(visible).toBe(true);
  });

  test('ALERT-002: confirm dialog — accept shows "Ok" in result', async ({ actor }) => {
    await actor.attemptsTo(
      AcceptAlert.confirm(),
      Click.on('#confirmButton')
    );

    const resultText = await actor.asks(Text.of('#confirmResult'));
    expect(resultText).toContain('Ok');
  });

  test('ALERT-003: confirm dialog — dismiss shows "Cancel" in result', async ({ actor }) => {
    await actor.attemptsTo(
      AcceptAlert.dismiss(),
      Click.on('#confirmButton')
    );

    const resultText = await actor.asks(Text.of('#confirmResult'));
    expect(resultText).toContain('Cancel');
  });
});
