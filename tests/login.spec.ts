import { test, expect, USERS } from '../fixtures/fixtures';

// Login tests must start unauthenticated — drop the project-level storageState.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test('standard user can log in', { tag: '@smoke' }, async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.items).not.toHaveCount(0);
  });

  const invalidCases = [
    {
      name: 'locked out user',
      creds: USERS.lockedOut,
      error: 'Epic sadface: Sorry, this user has been locked out.',
    },
    {
      name: 'wrong password',
      creds: { username: USERS.standard.username, password: 'nope' },
      error: 'Epic sadface: Username and password do not match any user in this service',
    },
    {
      name: 'empty username',
      creds: { username: '', password: 'secret_sauce' },
      error: 'Epic sadface: Username is required',
    },
  ];

  for (const { name, creds, error } of invalidCases) {
    test(`shows error for ${name}`, async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login(creds.username, creds.password);
      await expect(loginPage.error).toContainText(error);
    });
  }
});
