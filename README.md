# Playwright Demo Framework

A compact Playwright + TypeScript test framework demonstrating the patterns interviewers ask about: Page Object Model, custom fixtures, data-driven tests, API testing, and CI.

Targets: [saucedemo.com](https://www.saucedemo.com) (UI) and [jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com) (API).

## Structure

```
├── pages/          # Page Objects: locators in constructor, business actions as methods
├── fixtures/       # test.extend(): POM injection + `loggedIn` fixture
├── tests/
│   ├── auth.setup.ts      # setup project: UI login once → storageState
│   ├── login.spec.ts      # happy path + data-driven negative cases (no storageState)
│   ├── inventory.spec.ts  # cart, sorting — reuses the stored session
│   ├── api.spec.ts        # API tests via the built-in request context
│   ├── visual.spec.ts     # toHaveScreenshot against committed baselines
│   └── a11y.spec.ts       # axe-core scan with an explicit known-issues allowlist
├── perf/load-test.js      # k6 skeleton with p95/error-rate thresholds (manual run)
├── playwright.config.ts   # baseURL, trace on-first-retry, CI-only retries, projects
└── .github/workflows/     # CI: official Playwright Docker image + report artifact
```

## Design decisions (talking points)

- **User-facing locators first** (`getByRole`, `getByPlaceholder`), `data-test` attributes where the app provides them. No CSS chains or XPath.
- **Assertions live in tests, not in page objects** — web-first `expect` with auto-retry.
- **Auth once via a `setup` project**: UI login happens a single time and is saved as `storageState`; every test starts already authenticated. Login tests opt out with an empty `storageState`.
- **Fixtures over beforeEach**: tests declare what they need; the `loggedIn` fixture composes `loginPage` + `inventoryPage`.
- **Data-driven negatives**: the loop is outside `test()` so each case is a separate, parallel-safe test.
- **Retries and tracing only where they belong**: `retries: 2` in CI only, `trace: 'on-first-retry'` for debugging flake without slowing green runs.
- **Visual baselines are platform-specific**: committed baselines are generated locally (macOS); CI skips screenshot assertions via `ignoreSnapshots`. Upgrade path: generate Linux baselines with the Playwright Docker image.
- **A11y with a known-issues allowlist**: saucedemo has a real `select-name` violation — it's allowlisted explicitly (as a tracked bug would be) rather than weakening the assertion.
- **Perf tests stay out of PR CI**: the k6 script documents thresholds (`p(95)<800`, `rate<0.01`) and runs manually / on a dedicated environment.
- **Tags**: `@smoke` on the critical-path tests — `npx playwright test --grep @smoke`.

## What I'd add for a real product

Pact contract tests between services, CI sharding once the suite outgrows one runner, and Linux visual baselines via the Docker image.

## Run

```bash
npm ci
npx playwright install chromium
npm test            # headless
npm run test:ui     # UI mode
npm run report      # open HTML report
```
