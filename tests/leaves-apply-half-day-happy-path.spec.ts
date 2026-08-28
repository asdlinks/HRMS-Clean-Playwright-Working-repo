import { test, expect } from '../fixtures/auth';
import { LeavesPage } from '../pages/LeavesPage';
import { uniqueWeekdayRange } from '../fixtures/leave-data';
import { formatDisplayDate } from '../helpers/leave';
import { AppShellPopup } from '../pages/components/AppShellPopup';

/**
 * leaves-apply-half-day-happy-path — Full Day / Half Day is a mutually
 * exclusive toggle on the leave form (ISS-271). Half Day is a distinct
 * state from the default Full Day and was previously unexercised on its own
 * happy path (lv-ui-05 only covers the toggle's field-visibility effect, not
 * a full submit-and-verify flow) — it can have different validation/fields
 * and must be covered end-to-end on its own.
 */
test('Apply for Leave (Half Day): submit a valid half-day leave request', { tag: ['@sanity'] }, async ({ employeeSelfPage }) => {
  const leaves = new LeavesPage(employeeSelfPage);
  const { start } = uniqueWeekdayRange(1);
  const reason = `E2E half-day leave request ${Date.now()}`;

  await leaves.goto();
  await new AppShellPopup(employeeSelfPage).dismissIfPresent(5000).catch(() => {});

  await leaves.openApplyDrawer();
  await leaves.selectLeaveType('Casual');

  await leaves.halfDayToggle.click();
  await expect(leaves.halfDayToggle).toHaveAttribute('aria-pressed', 'true');
  await expect(leaves.fullDayToggle).toHaveAttribute('aria-pressed', 'false');

  // Half Day collapses to a single "Date" field (see lv-ui-05) — no
  // separate End Date field is rendered at all.
  await expect(leaves.endDateField).toHaveCount(0);
  await expect(leaves.drawer.getByLabel('Date')).toBeVisible();

  await leaves.startDateField.fill(start);
  await leaves.reasonField.fill(reason);
  await leaves.submit();

  await expect(leaves.drawer).toHaveCount(0);

  // A half-day request's start and end date are the same day — the grid's
  // Dates cell for it therefore renders "{start} → {start}".
  const dateRangeText = `${formatDisplayDate(start)} → ${formatDisplayDate(start)}`;

  await leaves.filterByStatus('All');
  const rowInAll = leaves.rowByDateRangeText(dateRangeText);
  await expect(rowInAll.first()).toBeVisible();

  await leaves.filterByStatus('Pending');
  const rowInPending = leaves.rowByDateRangeText(dateRangeText);
  await expect(rowInPending.first()).toBeVisible();
  await expect(rowInPending.first().getByText('Pending')).toBeVisible();
});
