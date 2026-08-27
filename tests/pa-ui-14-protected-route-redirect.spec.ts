import { expect, test } from '../fixtures/platformAdminAuth';

/** Platform Admin Auth UI coverage: PA-UI-14. Other source rows are split into sibling files or API-only. */
test('PA-UI-14: navigating to a protected Platform Admin route while unauthenticated redirects to /platform-admin/login', async ({ page }) => {
  await page.goto('/platform-admin/companies');
  await expect(page).toHaveURL(/\/platform-admin\/login$/);
});
