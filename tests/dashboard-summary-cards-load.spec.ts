import { test, expect } from '../fixtures/auth';
import { readPersonaUser } from '../fixtures/personas';

/**
 * Dashboard is the first page every employee sees after login; if summary
 * data fails to load it undermines trust in the whole app. Covers the
 * welcome banner (logged-in user's name + today's date) and the four
 * top-of-page summary cards: Leaves Available, Last Leave Taken, Team Out
 * This Week, Next Holiday.
 */
test('Dashboard loads welcome banner and summary cards', { tag: ['@sanity'] }, async ({ adminPage }) => {
  await adminPage.goto('/dashboard');

  // Welcome banner: name comes from the persona's own login response, so it
  // stays correct regardless of which tenant/account runs this.
  const admin = readPersonaUser('admin');
  test.skip(!admin, 'admin persona not configured.');

  const welcomeHeading = adminPage.getByRole('heading', { name: new RegExp(`Welcome,\\s*${admin!.name}`) });
  // This also acts as the "wait for loading to clear" step: the heading
  // only renders once the dashboard summary payload has loaded.
  await expect(welcomeHeading).toBeVisible();

  // Today's date, formatted the way the app renders it (e.g. "Tuesday, August 25").
  const today = new Date();
  const expectedDate = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  await expect(adminPage.getByText(expectedDate, { exact: true })).toBeVisible();

  // Leaves Available card — a link through to /leaves with a numeric value.
  const leavesAvailableCard = adminPage.getByRole('link', { name: /Leaves Available/ });
  await expect(leavesAvailableCard).toBeVisible();
  await expect(leavesAvailableCard.getByText('Leaves Available', { exact: true })).toBeVisible();
  await expect(leavesAvailableCard.getByRole('heading')).toBeVisible();
  await expect(leavesAvailableCard.getByRole('heading')).not.toHaveText('');

  // Last Leave Taken card.
  const lastLeaveLabel = adminPage.getByText('Last Leave Taken', { exact: true });
  await expect(lastLeaveLabel).toBeVisible();
  const lastLeaveCard = lastLeaveLabel.locator('..');
  await expect(lastLeaveCard.getByRole('heading')).toBeVisible();
  await expect(lastLeaveCard.getByRole('heading')).not.toHaveText('');

  // Team Out This Week card.
  const teamOutLabel = adminPage.getByText('Team Out This Week', { exact: true });
  await expect(teamOutLabel).toBeVisible();
  const teamOutCard = teamOutLabel.locator('..');
  await expect(teamOutCard.getByRole('heading')).toBeVisible();
  await expect(teamOutCard.getByRole('heading')).not.toHaveText('');

  // Next Holiday card — a link through to /holidays with a value.
  const nextHolidayCard = adminPage.getByRole('link', { name: /Next Holiday/ });
  await expect(nextHolidayCard).toBeVisible();
  await expect(nextHolidayCard.getByText('Next Holiday', { exact: true })).toBeVisible();
  await expect(nextHolidayCard.getByRole('heading')).toBeVisible();
  await expect(nextHolidayCard.getByRole('heading')).not.toHaveText('');
});
