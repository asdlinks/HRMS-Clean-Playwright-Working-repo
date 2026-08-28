import { test, expect } from '../fixtures/auth';
import { LeavesPage } from '../pages/LeavesPage';
import { AppShellPopup } from '../pages/components/AppShellPopup';

// Leave CSV was not present in the clean workspace. Automates LV-NG-01.
test('LV-NG-01: employeeSelf (no leaves.apply.any) has no way to target another employee', { tag: ['@regression'] }, async ({ employeeSelfPage }) => {
  const leaves = new LeavesPage(employeeSelfPage);
  await leaves.goto();
  // See lv-ui-05's popup-race comment: the missed-checkin popup can appear
  // after the page-wide auto-dismiss's bounded wait has already elapsed,
  // and would otherwise sit over the Apply for Leave button below.
  await new AppShellPopup(employeeSelfPage).dismissIfPresent(5000).catch(() => {});
  await leaves.openApplyDrawer();
  expect(await leaves.isTargetEmployeeFieldVisible()).toBe(false);
});
