# demoqa-screenplay

[![Playwright Tests](https://github.com/adrianagit87/demoqa-screenplay/actions/workflows/playwright.yml/badge.svg)](https://github.com/adrianagit87/demoqa-screenplay/actions/workflows/playwright.yml)

Proyecto de portafolio QA que demuestra el **patrón Screenplay** implementado manualmente con
**Playwright + TypeScript** — sin Serenity/JS ni librerías externas del patrón.

> **Aplicación bajo prueba:** [DemoQA](https://demoqa.com) — sitio público de práctica con formularios, widgets,
> alertas, drag-and-drop y más.

---

## ¿Por qué Screenplay en lugar de Page Object Model?

| Aspecto | Page Object Model (POM) | Patrón Screenplay |
|---|---|---|
| Encapsula | *Dónde* viven los elementos | *Quién hace qué* |
| Abstracción principal | Clase Page Object | Actor + Abilities |
| Unidad de reutilización | Método en una clase de página | Interaction / Task |
| Composabilidad | Baja — atada a la jerarquía de páginas | Alta — cualquier actor puede reutilizar cualquier interacción |
| Legibilidad | `loginPage.submit()` | `actor.attemptsTo(Click.on('#submit'))` |
| Acoplamiento del test | Alto — los tests dependen de los internos de la clase de página | Bajo — los tests se leen como lenguaje natural |

POM responde: *"¿dónde está este elemento?"*
Screenplay responde: *"¿quién realiza esta acción y cómo?"*

---

## Estructura del proyecto

```
demoqa-screenplay/
├── screenplay/
│   ├── core/           # Actor, Ability, Interaction, Task, Question (interfaces base)
│   ├── abilities/      # BrowseTheWeb — envuelve Playwright Page
│   ├── interactions/   # Acciones atómicas de UI (Click, Type, Navigate, …)
│   ├── questions/      # Lectura del estado de la UI (Text, Visibility, IsChecked, …)
│   └── tasks/          # Tareas de negocio de alto nivel — ver tabla completa abajo
├── fixtures/
│   └── actor.fixture.ts  # Playwright test.extend — inyecta el Actor en cada test
├── test-data/
│   └── form-data.ts      # Datos de prueba centralizados
├── tests/
│   ├── elements/         # text-box, check-box, radio-button, web-tables
│   ├── forms/            # practice-form
│   ├── alerts-frames/    # alerts
│   └── interactions/     # drag-and-drop
├── playwright.config.ts
└── tsconfig.json
```

---

## Bloques del patrón

| Bloque | Interfaz | Rol |
|---|---|---|
| **Actor** | Clase `Actor` | El "quién" — lleva las abilities e intenta interacciones |
| **Ability** | `Ability` | Otorga acceso a un sistema (navegador, API, base de datos) |
| **Interaction** | `Interaction` | Un paso atómico de UI (`Click`, `Type`, `Navigate`) |
| **Task** | `Task` | Una secuencia de interacciones que forma una acción de negocio |
| **Question** | `Question<T>` | Lee el estado de la UI sin efectos secundarios |

---

## Interactions disponibles

| Interaction | DSL | Descripción |
|---|---|---|
| `Navigate` | `Navigate.to('/ruta')` | Navega a una URL relativa a la baseURL |
| `Click` | `Click.on('#selector')` | Click estándar con checks de accionabilidad |
| `Click` (forzado) | `Click.forced('#selector')` | Bypasea checks — útil cuando un overlay cubre el elemento |
| `Type` | `Type.into('#selector', 'texto')` | Rellena un input con `.fill()` |
| `Check` | `Check.on('#selector')` | Marca un checkbox |
| `Select` | `Select.option('valor').from('#selector')` | Selecciona opción de un `<select>` nativo |
| `DragTo` | `DragTo.element('#src').onto('#target')` | Arrastra un elemento sobre otro |
| `AcceptAlert` | `AcceptAlert.confirm()` / `.dismiss()` | Acepta o descarta un diálogo del navegador |
| `WaitFor` | `WaitFor.visibility('#selector')` | Espera a que un elemento sea visible |

## Tasks disponibles

| Task | DSL | Descripción |
|---|---|---|
| `FillTextBox` | `FillTextBox.with(data)` | Rellena el formulario Text Box |
| `FillPracticeForm` | `FillPracticeForm.with(data)` | Rellena el formulario de práctica completo (campos opcionales incluidos) |
| `FillDatePicker` | `FillDatePicker.in('#selector').withDate('15 Jan 1995')` | Introduce una fecha en un input date picker |
| `FillDropdown` | `FillDropdown.select('opción').from('#selector')` | Selecciona una opción de un dropdown React-Select |
| `AddTableRecord` | `AddTableRecord.with(record)` | Abre el modal y añade una fila nueva a la tabla |
| `EditTableRecord` | `EditTableRecord.inRowContaining('texto').update('fieldId', 'valor')` | Edita un campo de la fila que contiene el texto indicado |
| `DeleteTableRecord` | `DeleteTableRecord.inRowContaining('texto')` | Elimina la fila que contiene el texto indicado |
| `ExpandTreeNode` | `ExpandTreeNode.root()` | Expande el nodo raíz del árbol rc-tree y espera la animación |
| `CheckTreeNode` | `CheckTreeNode.named('Documents')` | Marca el checkbox del nodo con ese nombre |

## Questions disponibles

| Question | DSL | Retorna |
|---|---|---|
| `Visibility` | `Visibility.of('#selector')` | `boolean` — si el elemento es visible |
| `Text` | `Text.of('#selector')` | `string` — texto del elemento |
| `Value` | `Value.of('#selector')` | `string` — valor de un input |
| `IsChecked` | `IsChecked.for('#selector')` | `boolean` — si un checkbox está marcado |
| `TableRowCount` | `TableRowCount.in('table')` | `number` — filas en el `tbody` de la tabla |

---

## Ejemplo de código — POM vs Screenplay

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

La versión Screenplay se lee como una historia de usuario. Las interacciones (`Type`, `Click`) son
reutilizables en *cualquier* test — sin duplicación en clases de página.

---

## Cobertura de pruebas (20 tests)

| Archivo | Casos |
|---|---|
| `elements/text-box.spec.ts` | TEXT-001..003 |
| `elements/check-box.spec.ts` | CHECK-001..003 |
| `elements/radio-button.spec.ts` | RADIO-001..002 |
| `elements/web-tables.spec.ts` | TABLE-001..003 |
| `forms/practice-form.spec.ts` | FORM-001..004 |
| `alerts-frames/alerts.spec.ts` | ALERT-001..003 |
| `interactions/drag-and-drop.spec.ts` | DRAG-001..002 |

---

## Cómo ejecutar

```bash
# 1. Clonar e instalar dependencias
git clone https://github.com/adrianagit87/demoqa-screenplay.git
cd demoqa-screenplay
npm install
npx playwright install chromium

# 2. Ejecutar todos los tests
npm test

# 3. Ejecutar una suite específica
npm run test:elements
npm run test:forms
npm run test:alerts
npm run test:interactions

# 4. Abrir el reporte HTML
npm run test:report
```

---

## Configuración

`playwright.config.ts` usa un único worker de Chromium (`workers: 1`) para evitar rate-limiting
del servidor público de DemoQA. Los dominios de publicidad se bloquean dentro de `actor.fixture.ts`
mediante `page.route` para impedir que los overlays de anuncios interfieran con los clicks.

---

## Proyecto relacionado

[restful-booker-tests](https://github.com/adrianagit87/restful-booker-tests) — proyecto de portafolio
complementario que utiliza el patrón **Page Object Model** sobre una aplicación REST API + UI.
