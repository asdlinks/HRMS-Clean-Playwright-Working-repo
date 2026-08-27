import { test, expect } from '../fixtures/auth';
import { EmployeesPage } from '../pages/EmployeesPage';
import { AppShellPopup } from '../pages/components/AppShellPopup';

/**
 * docs/EmployeeManagement_TestCases.csv — Automates EM-UI-12.
 * Other source cases are split into their own files or deliberately dropped
 * because they assert raw HTTP responses rather than rendered UI state.
 */
test('EM-UI-12: Manage Roles is only visible/loadable with roles.manage', { tag: ['@sanity'] }, async ({ usersManageOnlyPage }) => {
  const employees = new EmployeesPage(usersManageOnlyPage);
  await employees.goto();
  // See lv-ui-05's popup-race comment: the missed-checkin popup can appear
  // after the page-wide auto-dismiss's bounded wait has already elapsed.
  await new AppShellPopup(usersManageOnlyPage).dismissIfPresent(5000).catch(() => {});
  await employees.switchToTableView();
  const anyRow = usersManageOnlyPage.getByRole('row').nth(1);
  await expect(anyRow).toBeVisible();

  await expect(anyRow.getByRole('button', { name: 'Manage Roles' })).toHaveCount(0);
});
