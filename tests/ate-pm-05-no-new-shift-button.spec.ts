import { test, expect } from '../fixtures/auth';
import { ShiftsPage } from '../pages/ShiftsPage';

/**
 * CSV coverage: ATE-PM-05. ATE-PM-06 and ATE-PM-10 are automated in their
 * sibling split files; all other Attendance CSV rows are deliberately not
 * automated here because they belong to other source specs or scenarios.
 */
test('ATE-PM-05: a persona lacking shifts.manage sees no "New Shift" button', { tag: ['@regression'] }, async ({ hrDirectoryPage }) => {
  const shifts = new ShiftsPage(hrDirectoryPage);
  await shifts.goto();
  await expect(shifts.newShiftButton).toHaveCount(0);
});
