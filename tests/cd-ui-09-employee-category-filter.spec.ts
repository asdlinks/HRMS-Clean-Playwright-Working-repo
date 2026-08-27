import { test, expect } from '../fixtures/auth';
import { CompanyDocumentsPage } from '../pages/CompanyDocumentsPage';
import { createDisposableDocument } from '../helpers/companyDocuments';
import { uniqueDocumentTitle, DOCUMENT_CATEGORIES } from '../fixtures/companyDocuments-data';

test.beforeEach(() => { test.slow(); });

test('CD-UI-09: the employee view\'s category filter re-filters the already-fetched list without a new API call', { tag: ['@regression'] }, async ({ hrDirectoryPage, employeeSelfPage }) => {
  const title = uniqueDocumentTitle('CD-UI-09');
  await createDisposableDocument(hrDirectoryPage, { title, category: DOCUMENT_CATEGORIES[2], visibility: { allEmployees: true } });

  const docs = new CompanyDocumentsPage(employeeSelfPage);
  await docs.goto();
  expect(await docs.isEmployeeView()).toBe(true);
  // Confirm the row is genuinely fetched/rendered first (quick-filter
  // search, not page size alone — see CompanyDocumentsPage.search()'s doc
  // comment), THEN clear the search so the category filter below exercises
  // the real, full, already-fetched list this test is actually about.
  await docs.search(title);
  await expect(docs.row(title)).toBeVisible();
  await docs.clearSearch();

  let listCallsAfterLoad = 0;
  employeeSelfPage.on('request', (req) => {
    if (req.method() === 'GET' && /\/api\/company-documents(\?|$)/.test(new URL(req.url()).pathname + (new URL(req.url()).search || ''))) listCallsAfterLoad += 1;
  });
  await docs.filterByCategory(DOCUMENT_CATEGORIES[2]);
  await expect(docs.row(title)).toBeVisible();
  expect(listCallsAfterLoad).toBe(0); // client-side filter only — no re-fetch
});
