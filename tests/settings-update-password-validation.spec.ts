import { test, expect } from '../fixtures/auth';
import { PERSONAS } from '../fixtures/personas';
import { Toast } from '../pages/components/Toast';

/**
 * Settings > Password Management: negative-path coverage for the only form
 * on the newly-explored Settings page. Empty fields, a New/Confirm
 * mismatch, and a wrong Current Password are the realistic error states
 * that must be rejected cleanly, without ever changing the account's
 * password on a bad input.
 */
test.describe('Settings: Update Password form validation', () => {
  test('empty fields block submission via required-field validation', { tag: ['@regression'] }, async ({ adminPage }) => {
    await adminPage.goto('/settings');

    const currentPasswordField = adminPage.getByLabel('Current Password');
    const newPasswordField = adminPage.getByLabel('New Password');
    const confirmPasswordField = adminPage.getByLabel('Confirm Password');
    const updateButton = adminPage.getByRole('button', { name: 'Update Password' });

    await expect(currentPasswordField).toBeVisible();
    await updateButton.click();

    // Native required-field validation blocks the submit client-side: the
    // fields stay empty and invalid, and no API request is ever made.
    await expect(currentPasswordField).toHaveValue('');
    await expect(newPasswordField).toHaveValue('');
    await expect(confirmPasswordField).toHaveValue('');
    await expect(currentPasswordField).toHaveAttribute('required', '');
    await expect(newPasswordField).toHaveAttribute('required', '');
    await expect(confirmPasswordField).toHaveAttribute('required', '');
  });

  test('a New/Confirm Password mismatch is rejected', { tag: ['@regression'] }, async ({ adminPage }) => {
    const admin = PERSONAS.admin;
    test.skip(!admin, 'admin persona not configured.');

    await adminPage.goto('/settings');

    await adminPage.getByLabel('Current Password').fill(admin!.password);
    await adminPage.getByLabel('New Password').fill('Mismatch@New123');
    await adminPage.getByLabel('Confirm Password').fill('Mismatch@Different123');
    await adminPage.getByRole('button', { name: 'Update Password' }).click();

    await expect(adminPage.getByText('New passwords do not match!')).toBeVisible();
    // Rejected client-side before ever reaching the server — the fields are
    // left exactly as typed rather than being cleared out from under the user.
    await expect(adminPage.getByLabel('New Password')).toHaveValue('Mismatch@New123');
  });

  test('an incorrect Current Password is rejected by the server', { tag: ['@regression'] }, async ({ adminPage }) => {
    await adminPage.goto('/settings');

    await adminPage.getByLabel('Current Password').fill('DefinitelyWrong@000');
    await adminPage.getByLabel('New Password').fill('WouldBeNew@123');
    await adminPage.getByLabel('Confirm Password').fill('WouldBeNew@123');
    await adminPage.getByRole('button', { name: 'Update Password' }).click();

    // Server-side rejection surfaces via the shared Toast — the account's
    // real password must never be changed by a wrong-current-password attempt.
    await new Toast(adminPage).expectVisible('Current password is incorrect');
  });
});
