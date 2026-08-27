import { test, expect } from '../fixtures/auth';
import { CompanyDocumentsPage } from '../pages/CompanyDocumentsPage';
import { ConfirmDialog } from '../pages/components/ConfirmDialog';
import { escapeRegex } from '../helpers/locators';
import { createDisposableDocument } from '../helpers/companyDocuments';
import { uniqueDocumentTitle } from '../fixtures/companyDocuments-data';

test.beforeEach(() => { test.slow(); });

test('CD-FN-10 / CD-UI-06: deleting a document warns it is permanent, then removes it (and every version) transactionally', { tag: ['@smoke'] }, async ({ hrDirectoryPage }) => {
  const doc = await createDisposableDocument(hrDirectoryPage, { title: uniqueDocumentTitle('CD-FN-10') });
  const docs = new CompanyDocumentsPage(hrDirectoryPage);
  const confirm = new ConfirmDialog(hrDirectoryPage, new RegExp(`Delete "${escapeRegex(doc.title)}"\\?`));

  await docs.goto();
  await docs.deleteButton(doc.title).click();
  await confirm.expectVisible();
  await expect(hrDirectoryPage.getByText('This permanently removes the document and every version of it. This cannot be undone.')).toBeVisible();
  await confirm.confirm('Delete');
  await docs.toast('Document deleted');
  await expect(docs.row(doc.title)).toHaveCount(0);

  const getResponse = await hrDirectoryPage.request.get(`/api/company-documents/${doc.id}`);
  expect(getResponse.status()).toBe(404);
});
