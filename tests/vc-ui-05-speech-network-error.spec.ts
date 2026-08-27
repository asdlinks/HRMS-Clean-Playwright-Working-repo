import { test, expect } from '../fixtures/auth';
import { mockSpeechRecognition } from '../helpers/voice';

/** docs/VoiceCommands_TestCases.csv — Automates VC-UI-05. */
test('VC-UI-05: a genuine Speech API network error triggers the one user-visible error path anywhere in this feature — a browser alert()', { tag: ['@regression'] }, async ({ adminPage }) => {
  await mockSpeechRecognition(adminPage, { errorType: 'network' });
  let alertMessage = '';
  adminPage.on('dialog', async (dialog) => { alertMessage = dialog.message(); await dialog.accept(); });
  await adminPage.goto('/dashboard');
  const micButton = adminPage.getByRole('button', { name: 'Ask the AI assistant' });
  await micButton.waitFor({ state: 'visible' });
  await micButton.click();
  await expect.poll(() => alertMessage).toContain('couldn\'t connect to the speech servers');
  await expect(adminPage.getByRole('button', { name: 'Ask the AI assistant' })).toBeVisible();
});
