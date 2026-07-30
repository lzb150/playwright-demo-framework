import { test, expect } from '../fixtures/fixtures';

// Baselines live in tests/visual.spec.ts-snapshots/ and are platform-specific;
// CI skips these via `ignoreSnapshots` in the config (see comment there).
test.describe('Visual', () => {
  test('login page matches baseline', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('login-page.png', { maxDiffPixelRatio: 0.02 });
  });

  test('inventory grid matches baseline', async ({ loggedIn }) => {
    await expect(loggedIn.items.first()).toHaveScreenshot('inventory-item.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});
