import { expect, test } from '../fixtures/platformAdminAuth';
import { PlatformAdminCompanyListPage } from '../pages/PlatformAdminCompanyListPage';

/** Platform Admin Companies UI coverage: PA-UI-05. Other source rows are split or API-only. */
test('PA-UI-05: cycling the status filter changes which companies are listed', async ({ platformAdminPage }) => {
  const list = new PlatformAdminCompanyListPage(platformAdminPage);
  await list.goto();
  await list.filterByStatus('Suspended');
  await expect(list.row('Automation_old')).toBeVisible();
  await expect(platformAdminPage.getByRole('row', { name: /Golden Lotus/ })).toHaveCount(0);
  await list.filterByStatus('All statuses');
  await expect(list.row('Automation_old')).toBeVisible();
});
