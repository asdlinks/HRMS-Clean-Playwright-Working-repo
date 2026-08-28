import { test, expect } from '../fixtures/auth';
import { CompanyDocumentsPage } from '../pages/CompanyDocumentsPage';
import { AppShellPopup } from '../pages/components/AppShellPopup';
import { selectMaxDataGridPageSize } from '../helpers/locators';
import { assertSessionActive } from '../helpers/sessionGuard';

test.beforeEach(() => { test.slow(); });

test('CD-UI-01: the same route renders AdminDocumentsView (full CRUD) for a manage holder and EmployeeDocumentsView (read-only) for everyone else', { tag: ['@sanity'] }, async ({ hrDirectoryPage, employeeSelfPage }) => {
  // Not docs.goto() directly — see cd-fn-01's comment: the missed-checkin
  // popup's backdrop can appear mid-navigation and intercept goto()'s own
  // internal pagination-size click. Dismissing between the navigation and
  // that click removes the race.
  const adminDocs = new CompanyDocumentsPage(hrDirectoryPage);
  await hrDirectoryPage.goto('/company-documents');
  assertSessionActive(hrDirectoryPage);
  await new AppShellPopup(hrDirectoryPage).dismissIfPresent(5000).catch(() => {});
  await selectMaxDataGridPageSize(hrDirectoryPage);
  expect(await adminDocs.isAdminView()).toBe(true);
  await expect(adminDocs.uploadButton).toBeVisible();

  const employeeDocs = new CompanyDocumentsPage(employeeSelfPage);
  await employeeSelfPage.goto('/company-documents');
  assertSessionActive(employeeSelfPage);
  await new AppShellPopup(employeeSelfPage).dismissIfPresent(5000).catch(() => {});
  await selectMaxDataGridPageSize(employeeSelfPage);
  expect(await employeeDocs.isEmployeeView()).toBe(true);
  await expect(employeeDocs.uploadButton).toHaveCount(0);
});
