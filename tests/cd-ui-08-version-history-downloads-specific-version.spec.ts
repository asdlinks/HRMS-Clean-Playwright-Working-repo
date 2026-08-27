import { test, expect } from '../fixtures/auth';
import { CompanyDocumentsPage } from '../pages/CompanyDocumentsPage';
import { VersionHistoryDialog } from '../pages/VersionHistoryDialog';
import { createDisposableDocument, uploadVersionApi } from '../helpers/companyDocuments';
import { uniqueDocumentTitle } from '../fixtures/companyDocuments-data';
import { SAMPLE_PDF_PATH, SAMPLE_PNG_PATH } from '../fixtures/test-assets';

test('CD-UI-08: the Version History dialog\'s per-version download button requests that specific version', { tag: ['@regression'] }, async ({ hrDirectoryPage }) => {
  const doc = await createDisposableDocument(hrDirectoryPage, { title: uniqueDocumentTitle('CD-UI-08'), fileName: 'sample.pdf', file: SAMPLE_PDF_PATH });
  await uploadVersionApi(hrDirectoryPage, doc.id, { fileName: 'sample.png', file: SAMPLE_PNG_PATH });

  const docs = new CompanyDocumentsPage(hrDirectoryPage);
  const history = new VersionHistoryDialog(hrDirectoryPage);
  await docs.goto();
  await docs.versionHistoryButton(doc.title).click();
  await history.waitForOpen();
  await expect(history.root.locator('li')).toHaveCount(2);

  const [request] = await Promise.all([
    hrDirectoryPage.waitForRequest((req) => req.url().includes(`/company-documents/${doc.id}/download`) && req.url().includes('versionId=')),
    history.downloadButton(1).click(),
  ]);
  expect(request.url()).toContain('versionId=');
});
