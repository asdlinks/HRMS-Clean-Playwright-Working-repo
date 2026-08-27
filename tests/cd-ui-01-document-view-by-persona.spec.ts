import { test, expect } from '../fixtures/auth';
import { CompanyDocumentsPage } from '../pages/CompanyDocumentsPage';

test.beforeEach(() => { test.slow(); });

test('CD-UI-01: the same route renders AdminDocumentsView (full CRUD) for a manage holder and EmployeeDocumentsView (read-only) for everyone else', { tag: ['@sanity'] }, async ({ hrDirectoryPage, employeeSelfPage }) => {
  const adminDocs = new CompanyDocumentsPage(hrDirectoryPage);
  await adminDocs.goto();
  expect(await adminDocs.isAdminView()).toBe(true);
  await expect(adminDocs.uploadButton).toBeVisible();

  const employeeDocs = new CompanyDocumentsPage(employeeSelfPage);
  await employeeDocs.goto();
  expect(await employeeDocs.isEmployeeView()).toBe(true);
  await expect(employeeDocs.uploadButton).toHaveCount(0);
});
