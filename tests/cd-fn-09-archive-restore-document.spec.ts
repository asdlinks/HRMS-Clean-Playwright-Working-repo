import { test, expect } from '../fixtures/auth';
import { CompanyDocumentsPage } from '../pages/CompanyDocumentsPage';
import { createDisposableDocument } from '../helpers/companyDocuments';
import { uniqueDocumentTitle } from '../fixtures/companyDocuments-data';

test.beforeEach(() => { test.slow(); });

test('CD-FN-09 / CD-UI-07: archiving then restoring a document transitions active -> archived -> active, with the row action flipping labels', { tag: ['@smoke'] }, async ({ hrDirectoryPage }) => {
  const doc = await createDisposableDocument(hrDirectoryPage, { title: uniqueDocumentTitle('CD-FN-09') });
  const docs = new CompanyDocumentsPage(hrDirectoryPage);
  await docs.goto();

  // CompanyDocumentsPage.search() uses a placeholder regex (/search/i) that,
  // for an HR persona, also matches the global header's "Search employees…"
  // box, so it can't be reused here — the DataTable's own quick-filter is
  // the only <input type="search"> on the page, so getByRole('searchbox')
  // pins it down instead. Needed because this tenant's accumulated document
  // count already exceeds the 50-row max page size
  // (see CompanyDocumentsPage.search()'s doc comment).
  const quickFilter = hrDirectoryPage.getByRole('searchbox', { name: 'Search…' });

  await quickFilter.fill(doc.title);
  await expect(docs.archiveButton(doc.title)).toBeVisible();
  await docs.archiveButton(doc.title).click();
  await docs.toast('Document archived');
  await expect(docs.row(doc.title)).toHaveCount(0); // left the Active tab
  await docs.showArchived();
  await quickFilter.fill(doc.title);
  await expect(docs.restoreButton(doc.title)).toBeVisible(); // label flipped Archive -> Restore

  await docs.restoreButton(doc.title).click();
  await docs.toast('Document restored');
  await docs.showActive();
  await quickFilter.fill(doc.title);
  await expect(docs.archiveButton(doc.title)).toBeVisible(); // label flipped back
});
