import type { Actor } from '../core/Actor';
import type { Task } from '../core/Task';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

interface PracticeFormData {
  firstName: string;
  lastName: string;
  email?: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  dateOfBirth?: string;
  subjects?: string[];
  hobbies?: ('Sports' | 'Reading' | 'Music')[];
  address?: string;
  state?: string;
  city?: string;
}

export class FillPracticeForm implements Task {
  private constructor(private readonly data: PracticeFormData) {}

  static with(data: PracticeFormData): FillPracticeForm {
    return new FillPracticeForm(data);
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();

    await page.locator('#firstName').fill(this.data.firstName);
    await page.locator('#lastName').fill(this.data.lastName);

    if (this.data.email) {
      await page.locator('#userEmail').fill(this.data.email);
    }

    // Gender radio — label click avoids overlap issues
    await page.locator(`input[name="gender"][value="${this.data.gender}"] + label`).click();

    await page.locator('#userNumber').fill(this.data.mobile);

    if (this.data.dateOfBirth) {
      const dob = page.locator('#dateOfBirthInput');
      await dob.fill(this.data.dateOfBirth);
      await page.keyboard.press('Tab');
    }

    if (this.data.subjects) {
      for (const subject of this.data.subjects) {
        await page.locator('#subjectsInput').fill(subject);
        await page.locator('.subjects-auto-complete__option').filter({ hasText: subject }).first().click();
      }
    }

    if (this.data.hobbies) {
      for (const hobby of this.data.hobbies) {
        // Use JS click to bypass ad overlays covering the hobby labels
        await page.evaluate((hobbyName: string) => {
          // Labels use class="form-check-label" with for="hobbies-checkbox-N"
          const labels = Array.from(document.querySelectorAll('label[for^="hobbies"]'));
          for (const label of labels) {
            if (label.textContent?.trim() === hobbyName) {
              (label as HTMLElement).click();
              break;
            }
          }
        }, hobby);
      }
    }

    if (this.data.address) {
      await page.locator('#currentAddress').fill(this.data.address);
    }

    if (this.data.state) {
      await page.locator('#state').click();
      await page.locator('[class*="option"]').filter({ hasText: this.data.state }).click();
    }

    if (this.data.city && this.data.state) {
      await page.locator('#city').click();
      await page.locator('[class*="option"]').filter({ hasText: this.data.city }).click();
    }
  }
}
