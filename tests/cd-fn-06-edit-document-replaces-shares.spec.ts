import { test, expect } from '../fixtures/auth';
import { CompanyDocumentsPage } from '../pages/CompanyDocumentsPage';
import { DocumentFormDialog } from '../pages/DocumentFormDialog';
import { createDisposableDocument } from '../helpers/companyDocuments';
import { uniqueDocumentTitle } from '../fixtures/companyDocuments-data';
import { AppShellPopup } from '../pages/components/AppShellPopup';
import { selectMaxDataGridPageSize } from '../helpers/locators';
import { assertSessionActive } from '../helpers/sessionGuard';

test.beforeEach(() => { test.slow(); });

test('CD-FN-06: editing a document updates its metadata and fully replaces its share rows', { tag: ['@smoke'] }, async ({ hrDirectoryPage, managerPage }) => {
  const originalTitle = uniqueDocumentTitle('CD-FN-06');
  const updatedTitle = `${originalTitle} (edited)`;
  const doc = await createDisposableDocument(hrDirectoryPage, { title: originalTitle, visibility: { allEmployees: true } });

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
  await docs.editButton(originalTitle).click();
  await form.waitForOpen();
  await form.fill({ title: updatedTitle, allEmployees: false });
  await form.selectRole('Manager');
  await form.submit();
  await docs.toast('Document updated');
  await form.expectClosed();
  await expect(docs.row(updatedTitle)).toBeVisible({ timeout: 15_000 });

  // Share rows were fully replaced: 'all' is gone, 'role' (Manager) is now the only share.
  const detail = await (await hrDirectoryPage.request.get(`/api/company-documents/${doc.id}`)).json();
  expect(detail.shares).toHaveLength(1);
  expect(detail.shares[0].share_type).toBe('role');

  const asManager = await (await managerPage.request.get(`/api/company-documents/${doc.id}`)).json();
  expect(asManager.title).toBe(updatedTitle);
});
