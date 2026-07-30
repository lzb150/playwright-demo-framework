import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';

type Fixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  /** Inventory page opened with the standard_user session from storageState. */
  loggedIn: InventoryPage;
};

export const USERS = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  lockedOut: { username: 'locked_out_user', password: 'secret_sauce' },
} as const;

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  // Session comes from the storageState written by the `setup` project —
  // no UI login per test, just land on the page.
  loggedIn: async ({ page, inventoryPage }, use) => {
    await page.goto('/inventory.html');
    await use(inventoryPage);
  },
});

export { expect } from '@playwright/test';
