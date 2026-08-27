import { test, expect } from '../fixtures/auth';
import { LeavesPage } from '../pages/LeavesPage';
import { uniqueWeekdayRange } from '../fixtures/leave-data';
import { AppShellPopup } from '../pages/components/AppShellPopup';

// Leave CSV was not present in the clean workspace. Automates LV-UI-05.
test('LV-UI-05: toggling Half Day forces end_date = start_date and hides the End Date field', { tag: ['@sanity'] }, async ({ employeeSelfPage }) => {
  const leaves = new LeavesPage(employeeSelfPage);
  const { start } = uniqueWeekdayRange(1);
  await leaves.goto();
  // The AppShell missed-checkin popup's own fetch can resolve after the
  // page-wide auto-dismiss's short bounded wait has already elapsed —
  // explicitly give it a longer window here so it can't pop up mid-way
  // through openApplyDrawer()'s click and swallow it. The page-wide
  // auto-dismiss (fixtures/auth.ts) may win the race and remove it first,
  // so a detachment while we're dismissing is expected, not an error.
  await new AppShellPopup(employeeSelfPage).dismissIfPresent(5000).catch(() => {});
  await leaves.openApplyDrawer();
  await leaves.selectLeaveType('Casual');
  await leaves.startDateField.fill(start);
  await leaves.halfDayToggle.click();

  await expect(leaves.endDateField).toHaveCount(0);
  await expect(leaves.drawer.getByLabel('Date')).toHaveValue(start);
});
