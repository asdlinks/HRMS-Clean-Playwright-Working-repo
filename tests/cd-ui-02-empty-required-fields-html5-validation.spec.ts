import { test, expect } from '../fixtures/auth';
import { CompanyDocumentsPage } from '../pages/CompanyDocumentsPage';
import { DocumentFormDialog } from '../pages/DocumentFormDialog';
import { AppShellPopup } from '../pages/components/AppShellPopup';

test('CD-UI-02: submitting the Upload Document form with empty required fields is blocked by native HTML5 validation', { tag: ['@sanity'] }, async ({ hrDirectoryPage }) => {
  const docs = new CompanyDocumentsPage(hrDirectoryPage);
  const form = new DocumentFormDialog(hrDirectoryPage);
  await docs.goto();
  // See lv-ui-05's popup-race comment: the missed-checkin popup can appear
  // after the page-wide auto-dismiss's bounded wait has already elapsed,
  // and would otherwise sit over the Upload Document button below.
  await new AppShellPopup(hrDirectoryPage).dismissIfPresent(5000).catch(() => {});
  await docs.openUpload();
  await form.waitForOpen();
  await form.submit();
  // A native required-field violation blocks form submission client-side —
  // the dialog stays open and no request is ever sent.
  await expect(form.root).toBeVisible();
  expect(await form.titleField.evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
});
