import { expect, test } from '../fixtures/platformAdminAuth';
import { PlatformAdminLoginPage } from '../pages/PlatformAdminLoginPage';
import { PLATFORM_ADMIN_PERSONAS } from '../fixtures/platformAdminPersonas';

/** Platform Admin Auth UI coverage: PA-UI-15. Other source rows are split into sibling files or API-only. */
test('PA-UI-15: an access-token expiry with a failed refresh signs the user out and redirects to login', async ({ browser }) => {
  const primary = PLATFORM_ADMIN_PERSONAS.platformAdmin;
  test.skip(!primary, 'Platform-admin persona "platformAdmin" is not configured — see e2e/.env.e2e.example.');
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new PlatformAdminLoginPage(page);
  await loginPage.goto();
  await loginPage.login(primary!.email, primary!.password);
  await expect(page).toHaveURL(/\/platform-admin\/(?:companies|dashboard)$/);
  await page.route('**/api/platform-admin/auth/refresh', (route) =>
    route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ error: 'Session expired, please log in again' }) })
  );
  await page.reload();
  await expect(page).toHaveURL(/\/platform-admin\/login$/);
  await context.close();
});
