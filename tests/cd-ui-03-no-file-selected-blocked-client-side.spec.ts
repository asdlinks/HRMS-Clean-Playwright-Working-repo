import { test, expect } from '../fixtures/auth';
import { CompanyDocumentsPage } from '../pages/CompanyDocumentsPage';
import { DocumentFormDialog } from '../pages/DocumentFormDialog';
import { uniqueDocumentTitle, todayIso, DOCUMENT_CATEGORIES } from '../fixtures/companyDocuments-data';

test('CD-UI-03: submitting a new document with no file selected is blocked client-side with a clear message', { tag: ['@sanity'] }, async ({ hrDirectoryPage }) => {
  const docs = new CompanyDocumentsPage(hrDirectoryPage);
  const form = new DocumentFormDialog(hrDirectoryPage);
  await docs.goto();
  await docs.openUpload();
  await form.waitForOpen();
  await form.fill({ title: uniqueDocumentTitle('CD-UI-03'), category: DOCUMENT_CATEGORIES[0], effectiveDate: todayIso() });
  await form.submit();
  await expect(form.errorText('Please select a file to upload')).toBeVisible();
  await expect(form.root).toBeVisible(); // never actually submitted
});
