import { test, expect } from '../fixtures/auth';
import { EmployeesPage } from '../pages/EmployeesPage';
import { AppShellPopup } from '../pages/components/AppShellPopup';

// Employee CSV was not present in the clean workspace. Automates EM-NG-09.
test('EM-NG-09: users.password.reset is required — a caller without it never sees the Reset Password action', { tag: ['@regression'] }, async ({ usersManageOnlyPage }) => {
  const employees = new EmployeesPage(usersManageOnlyPage);
  await employees.goto();
  // See lv-ui-05's popup-race comment: the missed-checkin popup can appear
  // after the page-wide auto-dismiss's bounded wait has already elapsed.
  await new AppShellPopup(usersManageOnlyPage).dismissIfPresent(5000).catch(() => {});
  await employees.switchToTableView();
  const anyRow = usersManageOnlyPage.getByRole('row').nth(1);
  await expect(anyRow).toBeVisible();
  await employees.scrollActionsIntoView();
  await expect(anyRow.getByRole('button', { name: 'Reset Password' })).toHaveCount(0);
});
