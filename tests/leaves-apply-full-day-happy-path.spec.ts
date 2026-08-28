import { test, expect } from '../fixtures/auth';
import { LeavesPage } from '../pages/LeavesPage';
import { uniqueWeekdayRange } from '../fixtures/leave-data';
import { formatDisplayDate } from '../helpers/leave';
import { AppShellPopup } from '../pages/components/AppShellPopup';

/**
 * leaves-apply-full-day-happy-path — Full Day is the default/most common
 * leave request path; applying for leave is the core action of the Leaves
 * module and must work end-to-end. Uses uniqueWeekdayRange() (see
 * fixtures/leave-data.ts) so a same-day rerun against the shared
 * employeeSelf persona never collides with a leave request an earlier run
 * already left behind.
 */
test('Apply for Leave (Full Day): submit a valid full-day leave request end-to-end', { tag: ['@sanity'] }, async ({ employeeSelfPage }) => {
  const leaves = new LeavesPage(employeeSelfPage);
  const { start, end } = uniqueWeekdayRange(1);
  const reason = `E2E full-day leave request ${Date.now()}`;

  await leaves.goto();
  // See lv-ui-05's popup-race comment: the missed-checkin popup can appear
  // after the page-wide auto-dismiss's bounded wait has already elapsed.
  await new AppShellPopup(employeeSelfPage).dismissIfPresent(5000).catch(() => {});

  await leaves.openApplyDrawer();

  // Confirm the drawer's own defaults before touching anything.
  await expect(leaves.leaveTypeField).toHaveValue(/Casual Leave \(\d+ left\)/);
  await expect(leaves.fullDayToggle).toHaveAttribute('aria-pressed', 'true');
  await expect(leaves.halfDayToggle).toHaveAttribute('aria-pressed', 'false');
  await expect(leaves.endDateField).toBeVisible();

  await leaves.startDateField.fill(start);
  await leaves.endDateField.fill(end);
  await leaves.reasonField.fill(reason);
  await leaves.submit();

  // Modal closes.
  await expect(leaves.drawer).toHaveCount(0);

  // Appears under both All and Pending — matched via the grid's rendered
  // "{start} → {end}" Dates cell (see LeavesPage.rowByDateRangeText's doc
  // comment), since the grid has no Reason column to anchor on directly.
  const dateRangeText = `${formatDisplayDate(start)} → ${formatDisplayDate(end)}`;

  await leaves.filterByStatus('All');
  const rowInAll = leaves.rowByDateRangeText(dateRangeText);
  await expect(rowInAll.first()).toBeVisible();
  await expect(rowInAll.first().getByRole('gridcell', { name: 'Casual', exact: false })).toBeVisible();

  await leaves.filterByStatus('Pending');
  const rowInPending = leaves.rowByDateRangeText(dateRangeText);
  await expect(rowInPending.first()).toBeVisible();
  await expect(rowInPending.first().getByText('Pending')).toBeVisible();
});
