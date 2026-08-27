import { expect, test } from '../fixtures/platformAdminAuth';
import { PlatformAdminCompanyListPage } from '../pages/PlatformAdminCompanyListPage';

/** Platform Admin Companies UI coverage: PA-UI-04. Other source rows are split or API-only. */
test('PA-UI-04: typing in the search box filters the company list (debounced)', async ({ platformAdminPage }) => {
  const list = new PlatformAdminCompanyListPage(platformAdminPage);
  await list.goto();
  await list.search('golden-lotus');
  await expect(list.row('Golden Lotus')).toBeVisible();
  await expect(platformAdminPage.getByRole('row', { name: /Mywe Technologies/ })).toHaveCount(0);
});
