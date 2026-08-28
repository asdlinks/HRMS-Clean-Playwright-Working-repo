import { test, expect } from '../fixtures/auth';
import { PERSONAS, TENANT_CODE } from '../fixtures/personas';
import { LoginPage } from '../pages/LoginPage';
import { logoutViaUi } from '../helpers/tenantAuth';

/**
 * HRMS-1: login functionality, the Home page being the Dashboard, and a
 * full logout -> login round-trip. adminPage arrives already authenticated
 * (fixtures/auth.ts), so this test explicitly drives the logout/login UI
 * itself rather than relying on the fixture's own session.
 */
test('user can log out and log back in, landing on Dashboard', { tag: ['@sanity'] }, async ({ adminPage }) => {
  const admin = PERSONAS.admin;
  test.skip(!admin, 'admin persona not configured.');

  await adminPage.goto('/dashboard');
  // Home page is the Dashboard.
  await expect(adminPage).toHaveURL(/\/dashboard/);
  await expect(adminPage.getByRole('heading', { name: /Welcome,/ })).toBeVisible();

  // Open the account menu (unlabeled IconButton wrapping the Avatar) and log out.
  await logoutViaUi(adminPage);

  // Logging out redirects to the Login page.
  await expect(adminPage).toHaveURL(/\/login/);
  await expect(adminPage.getByLabel('Email Address')).toBeVisible();

  // Log back in with valid credentials.
  const loginPage = new LoginPage(adminPage);
  await loginPage.login(TENANT_CODE, admin!.email, admin!.password);

  // Successful login lands back on /dashboard.
  await loginPage.expectLoggedIn();
  await expect(adminPage.getByRole('heading', { name: /Welcome,/ })).toBeVisible();
});
