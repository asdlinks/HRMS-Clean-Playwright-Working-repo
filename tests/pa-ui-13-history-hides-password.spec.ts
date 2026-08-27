import { expect, test } from '../fixtures/platformAdminAuth';
import { PlatformAdminCompanyDetailPage } from '../pages/PlatformAdminCompanyDetailPage';
import { getProvisioningHistoryRequest } from '../helpers/platformAdminCompanies';

/** Platform Admin Companies UI coverage: PA-UI-13/PA-SC-10. Other source rows are split or API-only. */
test('PA-UI-13/PA-SC-10: provisioning history never renders a plaintext password, even for a real historical entry', async ({ platformAdminPage }) => {
  const res = await getProvisioningHistoryRequest(platformAdminPage.request, 20);
  const body = await res.json();
  const raw = JSON.stringify(body);
  expect(raw).not.toMatch(/"password"\s*:/i);
  expect(raw).not.toMatch(/"generatedPassword"\s*:/i);
  const detail = new PlatformAdminCompanyDetailPage(platformAdminPage);
  await detail.goto(20);
  await detail.historyTab.click();
  await detail.provisioningLogEntry(0).click();
  await expect(platformAdminPage.getByText(/^password:?\s*[\w!@#$%^&*]{6,}/i)).toHaveCount(0);
});
