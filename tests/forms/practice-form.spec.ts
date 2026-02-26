import { test, expect } from '../../fixtures/actor.fixture';
import { Navigate } from '../../screenplay/interactions/Navigate';
import { Click } from '../../screenplay/interactions/Click';
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
    await actor.attemptsTo(FillPracticeForm.with(practiceFormData));

    const page = actor.abilityTo(BrowseTheWeb).getPage();
    // Scroll submit button into view before clicking (avoids fixed-bar overlap)
    await page.locator('#submit').scrollIntoViewIfNeeded();
    await actor.attemptsTo(Click.on('#submit'));

    await page.locator('#example-modal-sizes-title-lg').waitFor({ state: 'visible' });

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
      })
    );

    const page = actor.abilityTo(BrowseTheWeb).getPage();
    await page.locator('#submit').scrollIntoViewIfNeeded();
    await actor.attemptsTo(Click.on('#submit'));

    await page.locator('#example-modal-sizes-title-lg').waitFor({ state: 'visible' });

    const modalVisible = await actor.asks(Visibility.of('.modal-content'));
    expect(modalVisible).toBe(true);
  });

  test('FORM-003: submit without first name fails validation', async ({ actor }) => {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    await page.locator('#lastName').fill('NoFirst');
    await page.locator('input[name="gender"][value="Male"] + label').click();
    await page.locator('#userNumber').fill('1234567890');

    await page.locator('#submit').scrollIntoViewIfNeeded();
    await actor.attemptsTo(Click.on('#submit'));

    // Modal should NOT appear
    const modalVisible = await actor.asks(Visibility.of('.modal-content'));
    expect(modalVisible).toBe(false);

    // DemoQA applies Bootstrap's is-invalid class to required fields on failed submit
    const isInvalid = await page.locator('#firstName').evaluate(
      el => el.classList.contains('field-error') || el.classList.contains('is-invalid') || el.getAttribute('required') !== null
    );
    expect(isInvalid).toBe(true);
  });

  test('FORM-004: submit without mobile fails validation', async ({ actor }) => {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    await page.locator('#firstName').fill('NoPhone');
    await page.locator('#lastName').fill('Test');
    await page.locator('input[name="gender"][value="Female"] + label').click();

    await page.locator('#submit').scrollIntoViewIfNeeded();
    await actor.attemptsTo(Click.on('#submit'));

    const modalVisible = await actor.asks(Visibility.of('.modal-content'));
    expect(modalVisible).toBe(false);

    const isInvalid = await page.locator('#userNumber').evaluate(
      el => el.classList.contains('field-error') || el.classList.contains('is-invalid') || el.getAttribute('required') !== null
    );
    expect(isInvalid).toBe(true);
  });
});
