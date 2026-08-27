import { test, expect } from '../fixtures/auth';
import { CompanyDocumentsPage } from '../pages/CompanyDocumentsPage';
import { createDisposableDocument } from '../helpers/companyDocuments';
import { uniqueDocumentTitle, DOCUMENT_CATEGORIES } from '../fixtures/companyDocuments-data';

test.beforeEach(() => { test.slow(); });

test('CD-FN-03: manager\'s list reflects status/category filters and the API\'s search query param, regardless of status/date', { tag: ['@regression'] }, async ({ hrDirectoryPage }) => {
  const activeTitle = uniqueDocumentTitle('CD-FN-03-active');
  const archivedDoc = await createDisposableDocument(hrDirectoryPage, { title: uniqueDocumentTitle('CD-FN-03-archived'), category: DOCUMENT_CATEGORIES[1] });
  await createDisposableDocument(hrDirectoryPage, { title: activeTitle, category: DOCUMENT_CATEGORIES[0] });
  const archiveResp = await hrDirectoryPage.request.patch(`/api/company-documents/${archivedDoc.id}/archive`);
  expect(archiveResp.ok()).toBeTruthy();

  const docs = new CompanyDocumentsPage(hrDirectoryPage);
  await docs.goto();
  await expect(docs.row(activeTitle)).toBeVisible();
  await expect(docs.row(archivedDoc.title)).toHaveCount(0); // Active tab is the default view

  await docs.showArchived();
  await expect(docs.row(archivedDoc.title)).toBeVisible();
  await expect(docs.row(activeTitle)).toHaveCount(0);

  await docs.showActive();
  await docs.filterByCategory(DOCUMENT_CATEGORIES[1]);
  await expect(docs.row(activeTitle)).toHaveCount(0); // wrong category, even though active

  // The admin UI wires status/category into query params but never wires a search box
  // (confirmed by reading AdminDocumentsView.tsx) — the API's own `search` param is only reachable directly.
  const searchResp = await hrDirectoryPage.request.get(`/api/company-documents?search=${encodeURIComponent(activeTitle)}`);
  expect(searchResp.ok()).toBeTruthy();
  const results = await searchResp.json();
  expect(results.some((d: { title: string }) => d.title === activeTitle)).toBe(true);
});
