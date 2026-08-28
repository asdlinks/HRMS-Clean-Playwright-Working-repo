import { test, expect } from '../fixtures/auth';
import { EmployeesPage } from '../pages/EmployeesPage';
import { AppShellPopup } from '../pages/components/AppShellPopup';

/**
 * docs/EmployeeManagement_TestCases.csv — Automates the UI-observable
 * EM-NG-11 case. The separate server-side EM-NG-11 / EM-SC-06 case is
 * deliberately omitted because it asserts only a raw HTTP response.
 */
test('EM-NG-11: PUT /:id/roles is blocked without roles.manage — no Manage Roles action to trigger it from', { tag: ['@regression'] }, async ({ usersManageOnlyPage }) => {
  const employees = new EmployeesPage(usersManageOnlyPage);
  await employees.goto();
  // See lv-ui-05's popup-race comment: the missed-checkin popup can appear
  // after the page-wide auto-dismiss's bounded wait has already elapsed,
  // and would otherwise sit over the Table View toggle below.
  await new AppShellPopup(usersManageOnlyPage).dismissIfPresent(5000).catch(() => {});
  await employees.switchToTableView();
  await expect(usersManageOnlyPage.getByRole('button', { name: 'Manage Roles' })).toHaveCount(0);
});
