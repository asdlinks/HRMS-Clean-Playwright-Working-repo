import { expect, test } from '../fixtures/platformAdminAuth';
import { PlatformAdminCompanyDetailPage } from '../pages/PlatformAdminCompanyDetailPage';

/** Platform Admin Companies UI coverage: PA-UI-12. Other source rows are split or API-only. */
test('PA-UI-12: the employee-usage "Approaching limit" chip is absent for a company comfortably under its plan limit', async ({ platformAdminPage }) => {
  const detail = new PlatformAdminCompanyDetailPage(platformAdminPage);
  await detail.goto(14);
  await expect(detail.employeeUsageSection.getByText(detail.approachingLimitChipText)).toHaveCount(0);
});
