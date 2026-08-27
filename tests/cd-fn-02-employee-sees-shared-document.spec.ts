import { test, expect } from '../fixtures/auth';
import { CompanyDocumentsPage } from '../pages/CompanyDocumentsPage';
import { createDisposableDocument } from '../helpers/companyDocuments';
import { uniqueDocumentTitle } from '../fixtures/companyDocuments-data';
import { AppShellPopup } from '../pages/components/AppShellPopup';

test.beforeEach(() => { test.slow(); });

test('CD-FN-02: employee sees an active, effective, all-employees-shared document', { tag: ['@smoke'] }, async ({ hrDirectoryPage, employeeSelfPage }) => {
  const doc = await createDisposableDocument(hrDirectoryPage, { title: uniqueDocumentTitle('CD-FN-02'), visibility: { allEmployees: true } });

  const docs = new CompanyDocumentsPage(employeeSelfPage);
  await docs.goto();
  // See lv-ui-05's popup-race comment: the missed-checkin popup can appear
  // after the page-wide auto-dismiss's bounded wait has already elapsed,
  // and would otherwise sit over the pagination control below.
  await new AppShellPopup(employeeSelfPage).dismissIfPresent(5000).catch(() => {});
  expect(await docs.isEmployeeView()).toBe(true);
  // Quick-filter search, not just a large page size — this tenant's
  // accumulated document count already exceeds the 50-row max page size
  // (see CompanyDocumentsPage.search()'s doc comment).
  await docs.search(doc.title);
  await expect(docs.row(doc.title)).toBeVisible();
});
