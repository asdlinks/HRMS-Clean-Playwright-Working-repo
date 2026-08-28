import { test, expect } from '../fixtures/auth';
import { CompanyDocumentsPage } from '../pages/CompanyDocumentsPage';
import { DocumentFormDialog } from '../pages/DocumentFormDialog';
import { uniqueDocumentTitle, todayIso, DOCUMENT_CATEGORIES } from '../fixtures/companyDocuments-data';
import { SAMPLE_PDF_PATH } from '../fixtures/test-assets';
import { AppShellPopup } from '../pages/components/AppShellPopup';
import { selectMaxDataGridPageSize } from '../helpers/locators';
import { assertSessionActive } from '../helpers/sessionGuard';

test.beforeEach(() => { test.slow(); });

test('CD-FN-01: manager uploads a document with title/category/dates/visibility/file via the real form', { tag: ['@smoke'] }, async ({ hrDirectoryPage }) => {
  const docs = new CompanyDocumentsPage(hrDirectoryPage);
  const form = new DocumentFormDialog(hrDirectoryPage);
  const title = uniqueDocumentTitle('CD-FN-01');

  // Not docs.goto() directly: the missed-checkin popup's async fetch can
  // resolve mid-navigation and show up right as goto()'s own internal
  // pagination-size click fires, intercepting it — confirmed live (the
  // popup's backdrop, a plain MuiBox-root, sits over the whole page).
  // Dismissing it between the navigation and that click (rather than only
  // after, as most other CompanyDocumentsPage specs do) removes the race
  // entirely for the one action that can't be preceded by any dismiss call.
  await hrDirectoryPage.goto('/company-documents');
  assertSessionActive(hrDirectoryPage);
  await new AppShellPopup(hrDirectoryPage).dismissIfPresent(5000).catch(() => {});
  await selectMaxDataGridPageSize(hrDirectoryPage);
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
