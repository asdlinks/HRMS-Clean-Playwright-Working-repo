import { test, expect } from '../fixtures/auth';
import { LeavesPage } from '../pages/LeavesPage';
import { uniqueWeekdayRange } from '../fixtures/leave-data';
import { formatDisplayDate } from '../helpers/leave';
import { AppShellPopup } from '../pages/components/AppShellPopup';

/**
 * leaves-apply-different-leave-types — the Leave Type combobox changes
 * which balance/type is being consumed, so each option is effectively a
 * distinct state of the form. leaves-apply-full-day-happy-path and
 * leaves-apply-half-day-happy-path only ever exercise the default "Casual
 * Leave" option — this test enumerates the combobox's actual options,
 * switches to a non-default one, confirms its own "(N left)" balance label
 * is shown (not Casual's), and submits a full end-to-end request under
 * that type.
 */
test('Apply for Leave: switching Leave Type combobox shows correct balances for each type', { tag: ['@regression'] }, async ({ employeeSelfPage }) => {
  const leaves = new LeavesPage(employeeSelfPage);
  const { start, end } = uniqueWeekdayRange(1);
  const reason = `E2E non-default leave type request ${Date.now()}`;

  await leaves.goto();
  await new AppShellPopup(employeeSelfPage).dismissIfPresent(5000).catch(() => {});

  await leaves.openApplyDrawer();

  // Confirm the default before touching anything.
  await expect(leaves.leaveTypeField).toHaveValue(/Casual Leave \(\d+ left\)/);

  // Enumerate the available Leave Type options.
  await leaves.leaveTypeField.click();
  const options = leaves.page.getByRole('option');
  await options.first().waitFor({ state: 'visible' });
  const optionCount = await options.count();
  expect(optionCount).toBeGreaterThan(1);

  const optionTexts: string[] = [];
  for (let i = 0; i < optionCount; i++) {
    optionTexts.push((await options.nth(i).textContent()) ?? '');
  }

  // Pick a non-default, non-disabled, non-Flexi-Holiday option so the plain
  // ApplyLeaveFields flow (no extra Flexi Holiday selection step) applies.
  const nonDefault = optionTexts.find((text) => {
    if (!text || text.startsWith('Casual')) return false;
    if (text.startsWith('Flexi Holiday')) return false;
    return true;
  });
  expect(nonDefault, `Expected at least one selectable non-Casual, non-Flexi-Holiday leave type among: ${optionTexts.join(', ')}`).toBeTruthy();

  const typePrefix = (nonDefault as string).split(/\s*\(/)[0].trim();

  await leaves.page.getByRole('option', { name: nonDefault as string, exact: true }).click();

  // The field now reflects the chosen type's own balance label, not Casual's.
  await expect(leaves.leaveTypeField).not.toHaveValue(/^Casual Leave/);
  await expect(leaves.leaveTypeField).toHaveValue(new RegExp(`^${typePrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\(\\d+ left\\)`));

  await leaves.startDateField.fill(start);
  await leaves.endDateField.fill(end);
  await leaves.reasonField.fill(reason);
  await leaves.submit();

  // Modal closes on success.
  await expect(leaves.drawer).toHaveCount(0);

  const dateRangeText = `${formatDisplayDate(start)} → ${formatDisplayDate(end)}`;

  await leaves.filterByStatus('All');
  const rowInAll = leaves.rowByDateRangeText(dateRangeText);
  await expect(rowInAll.first()).toBeVisible();
  await expect(rowInAll.first().getByRole('gridcell', { name: new RegExp(`^${typePrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`) })).toBeVisible();

  await leaves.filterByStatus('Pending');
  const rowInPending = leaves.rowByDateRangeText(dateRangeText);
  await expect(rowInPending.first()).toBeVisible();
  await expect(rowInPending.first().getByText('Pending')).toBeVisible();
});
