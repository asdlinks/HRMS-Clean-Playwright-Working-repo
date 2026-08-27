import { expect, test } from '../fixtures/platformAdminAuth';
import { PlatformAdminCompanyDetailPage } from '../pages/PlatformAdminCompanyDetailPage';

/** Platform Admin Companies UI coverage: PA-BD-12. Other source rows are split or API-only. */
test('PA-BD-12 (confirmed gap): no "Approaching limit" chip exists anywhere in the Storage Usage section, for any company, at any usage ratio', async ({ platformAdminPage }) => {
  const detail = new PlatformAdminCompanyDetailPage(platformAdminPage);
  await detail.goto(20);
  await expect(detail.storageUsageSection.getByText(detail.approachingLimitChipText)).toHaveCount(0);
});
