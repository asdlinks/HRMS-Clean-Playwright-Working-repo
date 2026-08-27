import { test, expect } from '../fixtures/auth';
import { LeavesPage } from '../pages/LeavesPage';
import { AppShellPopup } from '../pages/components/AppShellPopup';

// Leave CSV was not present in the clean workspace. Automates LV-VD-01.
test('LV-VD-01: submitting with type/start_date/end_date missing is blocked by required-field browser validation', { tag: ['@regression'] }, async ({ employeeSelfPage }) => {
  const leaves = new LeavesPage(employeeSelfPage);
  await leaves.goto();
  // See lv-ui-05's popup-race comment: the missed-checkin popup can appear
  // after the page-wide auto-dismiss's bounded wait has already elapsed.
  await new AppShellPopup(employeeSelfPage).dismissIfPresent(5000).catch(() => {});
  await leaves.openApplyDrawer();
  await leaves.submit();
  await expect(leaves.drawer).toBeVisible();
});
