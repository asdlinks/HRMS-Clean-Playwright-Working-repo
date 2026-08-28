import { test, expect } from '../fixtures/auth';
import { CompanyDocumentsPage } from '../pages/CompanyDocumentsPage';
import { DocumentFormDialog } from '../pages/DocumentFormDialog';
import { oversizedFileBuffer } from '../helpers/companyDocuments';
import { uniqueDocumentTitle, todayIso, DOCUMENT_CATEGORIES } from '../fixtures/companyDocuments-data';
import { AppShellPopup } from '../pages/components/AppShellPopup';
import { selectMaxDataGridPageSize } from '../helpers/locators';
import { assertSessionActive } from '../helpers/sessionGuard';

test.beforeEach(() => { test.slow(); });

test('CD-UI-05 (confirmed gap): no client-side file-size pre-check exists — an oversized file reaches the network before the 20MB limit is enforced server-side', { tag: ['@regression'] }, async ({ hrDirectoryPage }) => {
  const docs = new CompanyDocumentsPage(hrDirectoryPage);
  const form = new DocumentFormDialog(hrDirectoryPage);
  // Not docs.goto() directly — see cd-fn-01's comment: the missed-checkin
  // popup's backdrop can appear mid-navigation and intercept goto()'s own
  // internal pagination-size click. Dismissing between the navigation and
  // that click removes the race.
  await hrDirectoryPage.goto('/company-documents');
  assertSessionActive(hrDirectoryPage);
  await new AppShellPopup(hrDirectoryPage).dismissIfPresent(5000).catch(() => {});
  await selectMaxDataGridPageSize(hrDirectoryPage);
  await docs.openUpload();
  await form.waitForOpen();
  await form.fill({ title: uniqueDocumentTitle('CD-UI-05'), category: DOCUMENT_CATEGORIES[0], effectiveDate: todayIso() });
  await form.fileInput.setInputFiles({ name: 'oversized.pdf', mimeType: 'application/pdf', buffer: oversizedFileBuffer() });

  const [response] = await Promise.all([
    hrDirectoryPage.waitForResponse((res) => res.url().endsWith('/api/company-documents') && res.request().method() === 'POST'),
    form.submit(),
  ]);
  expect(response.status()).toBe(400); // the request WAS sent — no client-side block — and only THEN rejected
  await expect(form.errorText('20MB')).toBeVisible();
});
