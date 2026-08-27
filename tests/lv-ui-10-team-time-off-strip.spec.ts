import { test, expect } from '../fixtures/auth';

/**
 * CSV coverage: LV-UI-10. LV-UI-08 and LV-UI-09 are automated in sibling
 * split files; no Leave Dashboard CSV rows from this source are excluded.
 */
test('LV-UI-10: the "Team Time Off" / "Global Time Off" 7-day strip renders on the manager dashboard', { tag: ['@sanity'] }, async ({ managerPage }) => {
  await managerPage.goto('/');
  await expect(managerPage.getByText(/^(Team Time Off|Global Time Off)$/)).toBeVisible();
});
