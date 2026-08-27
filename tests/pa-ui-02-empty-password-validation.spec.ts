import { expect, test } from '../fixtures/platformAdminAuth';
import { PlatformAdminLoginPage } from '../pages/PlatformAdminLoginPage';

/** Platform Admin Auth UI coverage: PA-UI-02. Other source rows are split into sibling files or API-only. */
test('PA-UI-02: an empty password shows inline client-side validation', async ({ page }) => {
  const loginPage = new PlatformAdminLoginPage(page);
  await loginPage.goto();
  await loginPage.fillEmail('someone@example.com');
  await loginPage.submit();
  await expect(loginPage.passwordRequiredHelperText).toBeVisible();
});
