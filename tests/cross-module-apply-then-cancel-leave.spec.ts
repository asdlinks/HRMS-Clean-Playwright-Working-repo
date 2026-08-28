import { test, expect } from '../fixtures/auth';
import { LeavesPage } from '../pages/LeavesPage';
import { LeaveCancellationPage } from '../pages/LeaveCancellationPage';
import { uniqueWeekdayRange } from '../fixtures/leave-data';
import { formatDisplayDate } from '../helpers/leave';
import { AppShellPopup } from '../pages/components/AppShellPopup';

/**
 * cross-module-apply-then-cancel-leave — the primary cross-module flow:
 * leave application (Leaves) and leave cancellation (Leave Cancellation)
 * must interoperate correctly, with the status reflected consistently back
 * on the Leaves list. Uses uniqueWeekdayRange() so the request this test
 * creates is unambiguously identifiable by its date range even against the
 * shared employeeSelf persona's accumulated history.
 */
test('Cross-module: apply for a leave on /leaves, then cancel it via /cancellation, and verify status updates', { tag: ['@regression'] }, async ({ employeeSelfPage }) => {
  const leaves = new LeavesPage(employeeSelfPage);
  const cancellation = new LeaveCancellationPage(employeeSelfPage);
  const { start, end } = uniqueWeekdayRange(1);
  const reason = `E2E cross-module apply-then-cancel ${Date.now()}`;
  const dateRangeText = `${formatDisplayDate(start)} → ${formatDisplayDate(end)}`;

  // 1. Apply for a new Full Day leave on /leaves.
  await leaves.goto();
  await new AppShellPopup(employeeSelfPage).dismissIfPresent(5000).catch(() => {});
  await leaves.openApplyDrawer();
  await leaves.selectLeaveType('Casual');
  await leaves.startDateField.fill(start);
  await leaves.endDateField.fill(end);
  await leaves.reasonField.fill(reason);
  await leaves.submit();
  await expect(leaves.drawer).toHaveCount(0);

  // 2. Confirm it appears under Pending.
  await leaves.filterByStatus('Pending');
  const pendingRow = leaves.rowByDateRangeText(dateRangeText);
  await expect(pendingRow.first()).toBeVisible();
  await expect(pendingRow.first().getByText('Pending')).toBeVisible();

  // 3. Navigate to /cancellation and select the newly created leave.
  await cancellation.goto();
  await new AppShellPopup(employeeSelfPage).dismissIfPresent(5000).catch(() => {});
  // MenuItem text is "{TYPE} ({start} to {end})" — matches the option-label
  // prefix convention documented on LeaveCancellationPage.selectLeaveToCancel.
  await cancellation.selectLeaveToCancel(`Casual Leave (${formatDisplayDate(start)}`);
  await cancellation.fillReason('E2E cross-module cancellation — plans changed');
  await cancellation.submit();
  await cancellation.confirmCancellation();
  await cancellation.expectSuccessMessage();

  // 4. Back on /leaves, confirm it now appears under Cancelled and no
  // longer under Pending.
  await leaves.goto();
  await new AppShellPopup(employeeSelfPage).dismissIfPresent(5000).catch(() => {});

  await leaves.filterByStatus('Cancelled');
  const cancelledRow = leaves.rowByDateRangeText(dateRangeText);
  await expect(cancelledRow.first()).toBeVisible();
  await expect(cancelledRow.first().getByText('Cancelled')).toBeVisible();

  await leaves.filterByStatus('Pending');
  await expect(leaves.rowByDateRangeText(dateRangeText)).toHaveCount(0);
});
