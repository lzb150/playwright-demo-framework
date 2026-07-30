# Playwright Demo Framework

A compact Playwright + TypeScript test framework demonstrating the patterns interviewers ask about: Page Object Model, custom fixtures, data-driven tests, API testing, and CI.

Targets: [saucedemo.com](https://www.saucedemo.com) (UI) and [jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com) (API).

## Structure

```
├── pages/          # Page Objects: locators in constructor, business actions as methods
├── fixtures/       # test.extend(): POM injection + `loggedIn` fixture
├── tests/
│   ├── login.spec.ts      # happy path + data-driven negative cases
│   ├── inventory.spec.ts  # cart, sorting — uses the loggedIn fixture
│   └── api.spec.ts        # API tests via the built-in request context
├── playwright.config.ts   # baseURL, trace on-first-retry, CI-only retries
└── .github/workflows/     # CI: official Playwright Docker image + report artifact
```

## Design decisions (talking points)

- **User-facing locators first** (`getByRole`, `getByPlaceholder`), `data-test` attributes where the app provides them. No CSS chains or XPath.
- **Assertions live in tests, not in page objects** — web-first `expect` with auto-retry.
- **Fixtures over beforeEach**: tests declare what they need; the `loggedIn` fixture composes `loginPage` + `inventoryPage`.
- **Data-driven negatives**: the loop is outside `test()` so each case is a separate, parallel-safe test.
- **Retries and tracing only where they belong**: `retries: 2` in CI only, `trace: 'on-first-retry'` for debugging flake without slowing green runs.

## Run

```bash
npm ci
npx playwright install chromium
npm test            # headless
npm run test:ui     # UI mode
npm run report      # open HTML report
```
