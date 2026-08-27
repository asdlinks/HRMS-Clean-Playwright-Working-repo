import { expect, test } from '../fixtures/auth';
import { AppShellPopup } from '../pages/components/AppShellPopup';

/**
 * CSV coverage: ATE-SM-08's excluded-route suppression behavior. The full
 * eligible-user popup flow is automated in ate-sm-08-missed-checkin-popup-dismissal.spec.ts;
 * all other Attendance CSV rows belong to other source specs or scenarios.
 */
test('the popup never renders on /attendance or /login, regardless of check-in state', { tag: ['@regression'] }, async ({ employeeSelfPage }) => {
  const popup = new AppShellPopup(employeeSelfPage);

  await employeeSelfPage.goto('/attendance');
  await popup.expectHidden();
  await expect(popup.root).toHaveCount(0);

  await employeeSelfPage.goto('/login');
  await popup.expectHidden();
  await expect(popup.root).toHaveCount(0);
});
