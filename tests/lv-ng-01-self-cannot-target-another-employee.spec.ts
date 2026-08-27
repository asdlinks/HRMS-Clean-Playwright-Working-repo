import { test, expect } from '../fixtures/auth';
import { LeavesPage } from '../pages/LeavesPage';

// Leave CSV was not present in the clean workspace. Automates LV-NG-01.
test('LV-NG-01: employeeSelf (no leaves.apply.any) has no way to target another employee', { tag: ['@regression'] }, async ({ employeeSelfPage }) => {
  const leaves = new LeavesPage(employeeSelfPage);
  await leaves.goto();
  await leaves.openApplyDrawer();
  expect(await leaves.isTargetEmployeeFieldVisible()).toBe(false);
});
