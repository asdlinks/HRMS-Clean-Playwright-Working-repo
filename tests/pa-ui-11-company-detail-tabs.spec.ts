import { expect, test } from '../fixtures/platformAdminAuth';
import { PlatformAdminCompanyDetailPage } from '../pages/PlatformAdminCompanyDetailPage';

/** Platform Admin Companies UI coverage: PA-UI-11. Other source rows are split or API-only. */
test('PA-UI-11: Profile/Tenant Health/Usage/Provisioning History tabs each render their own content with no cross-tab leakage', async ({ platformAdminPage }) => {
  const detail = new PlatformAdminCompanyDetailPage(platformAdminPage);
  await detail.goto(20);
  await expect(detail.companyNameInput).toBeVisible();
  await expect(platformAdminPage.getByText('Setup Completion', { exact: true })).toHaveCount(0);
  await detail.healthTab.click();
  await expect(platformAdminPage.getByText('Setup Completion', { exact: true })).toBeVisible();
  await expect(detail.companyNameInput).toHaveCount(0);
  await detail.usageTab.click();
  await expect(platformAdminPage.getByText('Employee Count', { exact: true })).toBeVisible();
  await expect(platformAdminPage.getByText('Setup Completion', { exact: true })).toHaveCount(0);
  await detail.historyTab.click();
  await expect(platformAdminPage.getByText('Employee Count', { exact: true })).toHaveCount(0);
});
