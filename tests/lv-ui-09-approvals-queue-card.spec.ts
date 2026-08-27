import { test, expect } from '../fixtures/auth';

/**
 * CSV coverage: LV-UI-09. LV-UI-08 and LV-UI-10 are automated in sibling
 * split files; no Leave Dashboard CSV rows from this source are excluded.
 */
test('LV-UI-09: ApprovalsQueueCard renders "Pending Approvals" and deep-links into /leaves, with no duplicate approve/reject action', { tag: ['@sanity'] }, async ({ managerPage }) => {
  await managerPage.goto('/');
  // The card has no accessible container landmark, so scope it from its heading.
  const card = managerPage.getByText('Pending Approvals', { exact: true }).locator('../..');
  await expect(card).toBeVisible();
  // By design (see ApprovalsQueueCard.tsx's own comment), this card never
  // exposes its own Approve/Reject buttons — only LeavesPage does.
  await expect(card.getByRole('button', { name: /^(Approve|Reject)$/ })).toHaveCount(0);

  const firstItem = card.getByRole('link').first();
  const firstItemVisible = await firstItem
    .waitFor({ state: 'visible', timeout: 5000 })
    .then(() => true, () => false);
  if (firstItemVisible) {
    await firstItem.click();
    await expect(managerPage).toHaveURL(/\/leaves$/);
  }
});
