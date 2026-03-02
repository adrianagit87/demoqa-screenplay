import { test, expect } from '../../fixtures/actor.fixture';
import { Navigate } from '../../screenplay/interactions/Navigate';
import { Click } from '../../screenplay/interactions/Click';
import { Type } from '../../screenplay/interactions/Type';
import { WaitFor } from '../../screenplay/interactions/WaitFor';
import { FillPracticeForm } from '../../screenplay/tasks/FillPracticeForm';
import { Visibility } from '../../screenplay/questions/Visibility';
import { Text } from '../../screenplay/questions/Text';
import { BrowseTheWeb } from '../../screenplay/abilities/BrowseTheWeb';
import { practiceFormData } from '../../test-data/form-data';

test.describe('Practice Form', () => {
  test.beforeEach(async ({ actor }) => {
    await actor.attemptsTo(Navigate.to('/automation-practice-form'));
  });

  test('FORM-001: submit complete form and verify confirmation table', async ({ actor }) => {
    await actor.attemptsTo(
      FillPracticeForm.with(practiceFormData),
      Click.on('#submit'),
      WaitFor.visibility('#example-modal-sizes-title-lg'),
    );

    const modalVisible = await actor.asks(Visibility.of('.modal-content'));
    expect(modalVisible).toBe(true);

    const modalText = await actor.asks(Text.of('.modal-body'));
    expect(modalText).toContain(practiceFormData.firstName);
    expect(modalText).toContain(practiceFormData.lastName);
  });

  test('FORM-002: submit with only required fields succeeds', async ({ actor }) => {
    await actor.attemptsTo(
      FillPracticeForm.with({
        firstName: 'Min',
        lastName: 'Required',
        gender: 'Male',
        mobile: '0987654321',
      }),
      Click.on('#submit'),
      WaitFor.visibility('#example-modal-sizes-title-lg'),
    );

    const modalVisible = await actor.asks(Visibility.of('.modal-content'));
    expect(modalVisible).toBe(true);
  });

  test('FORM-003: submit without first name fails validation', async ({ actor }) => {
    await actor.attemptsTo(
      Type.into('#lastName', 'NoFirst'),
      Click.on('input[name="gender"][value="Male"] + label'),
      Type.into('#userNumber', '1234567890'),
      Click.on('#submit'),
    );

    const modalVisible = await actor.asks(Visibility.of('.modal-content'));
    expect(modalVisible).toBe(false);

    // page.evaluate() is used here for DOM inspection — no Screenplay interaction involved
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    const isInvalid = await page.locator('#firstName').evaluate(
      el => el.classList.contains('field-error') || el.classList.contains('is-invalid') || el.getAttribute('required') !== null
    );
    expect(isInvalid).toBe(true);
  });

  test('FORM-004: submit without mobile fails validation', async ({ actor }) => {
    await actor.attemptsTo(
      Type.into('#firstName', 'NoPhone'),
      Type.into('#lastName', 'Test'),
      Click.on('input[name="gender"][value="Female"] + label'),
      Click.on('#submit'),
    );

    const modalVisible = await actor.asks(Visibility.of('.modal-content'));
    expect(modalVisible).toBe(false);

    // page.evaluate() is used here for DOM inspection — no Screenplay interaction involved
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    const isInvalid = await page.locator('#userNumber').evaluate(
      el => el.classList.contains('field-error') || el.classList.contains('is-invalid') || el.getAttribute('required') !== null
    );
    expect(isInvalid).toBe(true);
  });
});
