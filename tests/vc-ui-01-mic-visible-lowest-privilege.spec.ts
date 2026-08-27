import { test, expect } from '../fixtures/auth';

/** docs/VoiceCommands_TestCases.csv — Automates VC-UI-01 (partial). */
test('VC-UI-01 (partial): the mic button renders unconditionally for the lowest-privilege configured persona — TopNav has no hasPermission(\'voice.use\') gate of any kind', { tag: ['@sanity'] }, async ({ employeeSelfPage }) => {
  await employeeSelfPage.goto('/dashboard');
  await expect(employeeSelfPage.getByRole('button', { name: 'Ask the AI assistant' })).toBeVisible();
});
