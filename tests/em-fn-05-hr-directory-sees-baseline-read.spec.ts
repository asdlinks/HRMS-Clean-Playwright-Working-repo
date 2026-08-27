import { test, expect } from '../fixtures/auth';
import { EmployeesPage } from '../pages/EmployeesPage';

test('EM-FN-05: users.view.directory sees the baseline company-wide read', { tag: ['@regression'] }, async ({ hrDirectoryPage }) => {
  const employees = new EmployeesPage(hrDirectoryPage);
  await employees.goto();
  await expect(hrDirectoryPage.getByText(/forbidden|access denied/i)).toHaveCount(0);
  // Scoped timeout, not the global default: the shared dev tenant's growing
  // record count pushes this render past Playwright's 5s expect default —
  // see FRAMEWORK_TECH_DEBT.md (C5), same pattern as Toast.expectVisible().
  await expect(employees.totalEmployeesStat).toBeVisible({ timeout: 15_000 });
});
