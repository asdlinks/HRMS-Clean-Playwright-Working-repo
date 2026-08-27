import { test, expect } from '../fixtures/auth';
import { CompanyDocumentsPage } from '../pages/CompanyDocumentsPage';
import { DocumentFormDialog } from '../pages/DocumentFormDialog';
import { uniqueDocumentTitle, todayIso, DOCUMENT_CATEGORIES } from '../fixtures/companyDocuments-data';
import { DISALLOWED_EXTENSION_PATH } from '../fixtures/test-assets';
import { AppShellPopup } from '../pages/components/AppShellPopup';

test('CD-UI-04 (confirmed gap): the file input\'s accept="..." attribute is cosmetic only — setInputFiles bypasses it, and the server 400 surfaces in the dialog', { tag: ['@regression'] }, async ({ hrDirectoryPage }) => {
  const docs = new CompanyDocumentsPage(hrDirectoryPage);
  const form = new DocumentFormDialog(hrDirectoryPage);
  await docs.goto();
  // See lv-ui-05's popup-race comment: the missed-checkin popup can appear
  // after the page-wide auto-dismiss's bounded wait has already elapsed,
  // and would otherwise sit over the Upload Document button below.
  await new AppShellPopup(hrDirectoryPage).dismissIfPresent(5000).catch(() => {});
  await docs.openUpload();
  await form.waitForOpen();
  await form.fill({ title: uniqueDocumentTitle('CD-UI-04'), category: DOCUMENT_CATEGORIES[0], effectiveDate: todayIso() });
  // setInputFiles talks to the DOM node directly — it never consults the
  // input's own `accept` attribute, the same bypass a real drag-drop or
  // "All files" toggle would achieve in a live browser.
  await form.setFile(DISALLOWED_EXTENSION_PATH);
  await form.submit();
  await expect(form.errorText(/is not allowed/)).toBeVisible();
});
