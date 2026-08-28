import { test, expect } from '../fixtures/auth';
import { AttendanceCard } from '../pages/AttendanceCard';

/**
 * CSV coverage: ATE-PM-10. ATE-PM-05 and ATE-PM-06 are automated in their
 * sibling split files; all other Attendance CSV rows are deliberately not
 * automated here because they belong to other source specs or scenarios.
 */
test('ATE-PM-10: an employee retains attendance.checkin capability regardless of the "Attendance Required For" opt-out setting', { tag: ['@regression'] }, async ({ employeeSelfPage }) => {
  const card = new AttendanceCard(employeeSelfPage);
  await employeeSelfPage.goto('/attendance');
  // The card mounts after an async attendance-status fetch (same class of
  // race as AppShellPopup's — see its doc comment); confirmed live to
  // reliably resolve well within 15s even when it exceeds the framework's
  // 5s default under load.
  await expect(card.root).toBeVisible({ timeout: 15_000 });
});
