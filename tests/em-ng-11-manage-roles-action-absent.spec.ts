import { test, expect } from '../fixtures/auth';
import { EmployeesPage } from '../pages/EmployeesPage';

/**
 * docs/EmployeeManagement_TestCases.csv — Automates the UI-observable
 * EM-NG-11 case. The separate server-side EM-NG-11 / EM-SC-06 case is
 * deliberately omitted because it asserts only a raw HTTP response.
 */
test('EM-NG-11: PUT /:id/roles is blocked without roles.manage — no Manage Roles action to trigger it from', { tag: ['@regression'] }, async ({ usersManageOnlyPage }) => {
  const employees = new EmployeesPage(usersManageOnlyPage);
  await employees.goto();
  await employees.switchToTableView();
  await expect(usersManageOnlyPage.getByRole('button', { name: 'Manage Roles' })).toHaveCount(0);
});
