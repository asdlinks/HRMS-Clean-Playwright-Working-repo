import { test, expect } from '../fixtures/auth';
import { CompanyDocumentsPage } from '../pages/CompanyDocumentsPage';
import { DocumentFormDialog } from '../pages/DocumentFormDialog';
import { uniqueDocumentTitle, todayIso, DOCUMENT_CATEGORIES } from '../fixtures/companyDocuments-data';
import { SAMPLE_PDF_PATH } from '../fixtures/test-assets';

test.beforeEach(() => { test.slow(); });

test('CD-FN-01: manager uploads a document with title/category/dates/visibility/file via the real form', { tag: ['@smoke'] }, async ({ hrDirectoryPage }) => {
  const docs = new CompanyDocumentsPage(hrDirectoryPage);
  const form = new DocumentFormDialog(hrDirectoryPage);
  const title = uniqueDocumentTitle('CD-FN-01');

  await docs.goto();
  expect(await docs.isAdminView()).toBe(true);
  await docs.openUpload();
  await form.waitForOpen();
  await form.fill({ title, category: DOCUMENT_CATEGORIES[0], description: 'E2E: CD-FN-01', effectiveDate: todayIso(), allEmployees: true });
  await form.setFile(SAMPLE_PDF_PATH);
  await form.submit();
  await docs.toast('Document published');
  await form.expectClosed();

  const row = docs.row(title);
  await expect(row).toBeVisible();
  await expect(row.getByRole('gridcell', { name: 'v1' })).toBeVisible();
});
