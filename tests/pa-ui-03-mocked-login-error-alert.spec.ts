import { expect, test } from '../fixtures/platformAdminAuth';
import { PlatformAdminLoginPage } from '../pages/PlatformAdminLoginPage';

/** Platform Admin Auth UI coverage: PA-UI-03. Other source rows are split into sibling files or API-only. */
test('PA-UI-03: a mocked 401/429 login response is surfaced in the top-level Alert', async ({ page }) => {
  const loginPage = new PlatformAdminLoginPage(page);
  await page.route('**/api/platform-admin/auth/login', (route) =>
    route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ error: 'Invalid email or password' }) })
  );
  await loginPage.goto();
  await loginPage.login('someone@example.com', 'wrong-password');
  await expect(loginPage.serverErrorAlert).toBeVisible();
  await expect(loginPage.serverErrorAlert).toContainText(/invalid email or password/i);

  await page.route('**/api/platform-admin/auth/login', (route) =>
    route.fulfill({ status: 429, contentType: 'application/json', body: JSON.stringify({ error: 'Too many login attempts from this location. Please try again later.' }) })
  );
  await loginPage.goto();
  await loginPage.login('someone@example.com', 'wrong-password');
  await expect(loginPage.serverErrorAlert).toBeVisible();
  await expect(loginPage.serverErrorAlert).toContainText(/too many login attempts/i);
});
