import { expect, test } from '../fixtures/platformAdminAuth';
import { PlatformAdminLoginPage } from '../pages/PlatformAdminLoginPage';

/** Platform Admin Auth UI coverage: PA-UI-01. Other source rows are split into sibling files or API-only. */
test('PA-UI-01: an invalid email format shows inline client-side validation', async ({ page }) => {
  const loginPage = new PlatformAdminLoginPage(page);
  await loginPage.goto();
  await loginPage.fillEmail('notanemail');
  await loginPage.fillPassword('SomePassword123');
  await loginPage.submit();
  await expect(loginPage.invalidEmailHelperText).toBeVisible();
});
