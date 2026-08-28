import { test, expect } from '../fixtures/auth';

/**
 * CSV coverage: LV-UI-08. LV-UI-09 and LV-UI-10 are automated in sibling
 * split files; no Leave Dashboard CSV rows from this source are excluded.
 */
test('LV-UI-08: LeaveAllocationChart (Allocated vs Used) renders on the employee dashboard', { tag: ['@sanity'] }, async ({ employeeSelfPage }) => {
  await employeeSelfPage.goto('/');
  // Empty-message fallback when nothing is configured; either state confirms
  // that the widget rendered without erroring. The chart mounts after an
  // async leave-allocations fetch (same class of race as AttendanceCard's —
  // see ate-pm-10's comment); confirmed live to reliably resolve well
  // within 15s even when it exceeds the framework's 5s default under load.
  await expect(
    employeeSelfPage.getByText('No leave allocations configured.').or(employeeSelfPage.locator('.recharts-wrapper')).first()
  ).toBeVisible({ timeout: 15_000 });
});
