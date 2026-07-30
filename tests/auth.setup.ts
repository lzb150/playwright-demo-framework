import { test as setup, expect } from '@playwright/test';
import { USERS } from '../fixtures/fixtures';

export const AUTH_FILE = 'playwright/.auth/standard-user.json';

setup('authenticate as standard user', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill(USERS.standard.username);
  await page.getByPlaceholder('Password').fill(USERS.standard.password);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  await page.context().storageState({ path: AUTH_FILE });
});
