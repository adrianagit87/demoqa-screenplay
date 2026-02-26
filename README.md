# demoqa-screenplay

[![Playwright Tests](https://github.com/adrianagit87/demoqa-screenplay/actions/workflows/playwright.yml/badge.svg)](https://github.com/adrianagit87/demoqa-screenplay/actions/workflows/playwright.yml)

A QA portfolio project demonstrating the **Screenplay pattern** implemented manually with
**Playwright + TypeScript** — no Serenity/JS or external pattern libraries.

> **Target app:** [DemoQA](https://demoqa.com) — a public practice site with forms, widgets,
> alerts, drag-and-drop interactions, and more.

---

## Why Screenplay instead of Page Object Model?

| Concern | Page Object Model (POM) | Screenplay Pattern |
|---|---|---|
| Encapsulates | *Where* elements live | *Who does what* |
| Main abstraction | Page Object class | Actor + Abilities |
| Reuse unit | Method on a page class | Interaction / Task |
| Composability | Low — tied to page hierarchy | High — any actor can reuse any interaction |
| Readability | `loginPage.submit()` | `actor.attemptsTo(Click.on('#submit'))` |
| Test coupling | High — tests depend on page class internals | Low — tests read like plain English |

POM answers: *"where is this element?"*
Screenplay answers: *"who does this action, and how?"*

---

## Project structure

```
demoqa-screenplay/
├── screenplay/
│   ├── core/           # Actor, Ability, Interaction, Task, Question interfaces
│   ├── abilities/      # BrowseTheWeb — wraps Playwright Page
│   ├── interactions/   # Atomic UI actions (Click, Type, Navigate, …)
│   ├── questions/      # Read UI state (Text, Visibility, IsChecked, …)
│   └── tasks/          # High-level business tasks (FillPracticeForm, AddTableRecord, …)
├── fixtures/
│   └── actor.fixture.ts  # Playwright test.extend — injects Actor into every test
├── test-data/
│   └── form-data.ts      # Centralised test data
├── tests/
│   ├── elements/         # text-box, check-box, radio-button, web-tables
│   ├── forms/            # practice-form
│   ├── alerts-frames/    # alerts
│   └── interactions/     # drag-and-drop
├── playwright.config.ts
└── tsconfig.json
```

---

## Pattern building blocks

| Building block | Interface | Role |
|---|---|---|
| **Actor** | `Actor` class | The "who" — carries abilities, attempts interactions |
| **Ability** | `Ability` | Grants access to a system (browser, API, database) |
| **Interaction** | `Interaction` | A single atomic UI step (`Click`, `Type`, `Navigate`) |
| **Task** | `Task` | A sequence of interactions forming a business action |
| **Question** | `Question<T>` | Reads state from the UI without side effects |

---

## Code example — POM vs Screenplay side by side

### Page Object Model

```typescript
// LoginPage.ts
class LoginPage {
  async fillEmail(email: string) { await this.page.fill('#email', email); }
  async submit() { await this.page.click('#submit'); }
}

// login.spec.ts
test('login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.fillEmail('user@test.com');
  await loginPage.submit();
  expect(await page.locator('.welcome').isVisible()).toBe(true);
});
```

### Screenplay

```typescript
// login.spec.ts
test('login', async ({ actor }) => {
  await actor.attemptsTo(
    Navigate.to('/login'),
    Type.into('#email', 'user@test.com'),
    Click.on('#submit')
  );
  const isWelcomeVisible = await actor.asks(Visibility.of('.welcome'));
  expect(isWelcomeVisible).toBe(true);
});
```

The Screenplay version reads like a user story. New interactions (`Type`, `Click`) are reusable
across *any* test — no duplication in page classes.

---

## Test coverage (20 tests)

| File | Cases |
|---|---|
| `elements/text-box.spec.ts` | TEXT-001..003 |
| `elements/check-box.spec.ts` | CHECK-001..003 |
| `elements/radio-button.spec.ts` | RADIO-001..002 |
| `elements/web-tables.spec.ts` | TABLE-001..003 |
| `forms/practice-form.spec.ts` | FORM-001..004 |
| `alerts-frames/alerts.spec.ts` | ALERT-001..003 |
| `interactions/drag-and-drop.spec.ts` | DRAG-001..002 |

---

## Getting started

```bash
# 1. Clone and install
git clone https://github.com/<your-username>/demoqa-screenplay.git
cd demoqa-screenplay
npm install
npx playwright install chromium

# 2. Run all tests
npm test

# 3. Run a specific suite
npm run test:elements
npm run test:forms
npm run test:alerts
npm run test:interactions

# 4. Open HTML report
npm run test:report
```

---

## Configuration

`playwright.config.ts` uses a single Chromium worker (`workers: 1`) to avoid rate-limiting from
the public DemoQA server. Ad domains are blocked inside `actor.fixture.ts` using `page.route` to
prevent ad overlays from blocking clicks.

---

## Related project

[restful-booker-tests](https://github.com/<your-username>/restful-booker-tests) — the companion
portfolio project using the **Page Object Model** pattern on a REST API + UI target.
