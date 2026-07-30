import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../fixtures/fixtures';

test.describe('Accessibility', () => {
  test('login page has no critical violations', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    const critical = results.violations.filter(v => v.impact === 'critical');
    expect(critical.map(v => `${v.id}: ${v.description}`)).toEqual([]);
  });

  test('inventory page has no critical violations', async ({ loggedIn, page }) => {
    // saucedemo ships a real a11y bug: the sort <select> has no accessible
    // name. Known issues are allowlisted explicitly (and would be tracked as
    // bugs) instead of loosening the assertion for everything else.
    const KNOWN_ISSUES = ['select-name'];
    await expect(loggedIn.title).toHaveText('Products');
    const results = await new AxeBuilder({ page }).analyze();
    const critical = results.violations.filter(
      v => v.impact === 'critical' && !KNOWN_ISSUES.includes(v.id),
    );
    expect(critical.map(v => `${v.id}: ${v.description}`)).toEqual([]);
  });
});
