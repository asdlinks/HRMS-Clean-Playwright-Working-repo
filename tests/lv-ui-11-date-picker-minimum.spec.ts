import { test, expect } from '../fixtures/auth';
import { LeavesPage } from '../pages/LeavesPage';
import { AppShellPopup } from '../pages/components/AppShellPopup';

// Leave CSV was not present in the clean workspace. Automates LV-UI-11.
test('LV-UI-11: the date-picker minimum is hardcoded to 2026-01-01 rather than computed from today (known gap)', { tag: ['@regression'] }, async ({ employeeSelfPage }) => {
  const leaves = new LeavesPage(employeeSelfPage);
  await leaves.goto();
  // See lv-ui-05's popup-race comment: the missed-checkin popup can appear
  // after the page-wide auto-dismiss's bounded wait has already elapsed.
  await new AppShellPopup(employeeSelfPage).dismissIfPresent(5000).catch(() => {});
  await leaves.openApplyDrawer();
  await leaves.selectLeaveType('Casual');
  await expect(leaves.startDateField).toHaveAttribute('min', '2026-01-01');
});
