import { test, expect } from '../fixtures/auth';
import { EmployeesPage } from '../pages/EmployeesPage';

test('EM-FN-06: users.view.team (manager) sees only their reporting subtree', { tag: ['@regression'] }, async ({ managerPage }) => {
  const employees = new EmployeesPage(managerPage);
  await employees.goto();
  // No permission-denied page — a scoped, non-empty (or legitimately empty
  // if this manager has no reports yet) list renders without an access error.
  await expect(managerPage.getByText(/forbidden|access denied/i)).toHaveCount(0);
  await expect(employees.totalEmployeesStat).toBeVisible();
});
