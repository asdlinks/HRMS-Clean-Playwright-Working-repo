import { test, expect } from '../fixtures/auth';
import { mockNoSpeechRecognitionSupport } from '../helpers/voice';

/** docs/VoiceCommands_TestCases.csv — Automates VC-UI-04. */
test('VC-UI-04 (confirmed gap): with no Web Speech API implementation at all, the mic button still renders and remains silently clickable — toggleListening() no-ops with zero user-visible feedback, not even an error state', { tag: ['@regression'] }, async ({ adminPage }) => {
  await mockNoSpeechRecognitionSupport(adminPage);
  let dialogFired = false;
  adminPage.on('dialog', async (dialog) => { dialogFired = true; await dialog.dismiss(); });
  await adminPage.goto('/dashboard');
  const micButton = adminPage.getByRole('button', { name: 'Ask the AI assistant' });
  await expect(micButton).toBeVisible();
  await micButton.click();
  await expect(adminPage.getByRole('button', { name: 'Stop listening' })).toHaveCount(0);
  expect(dialogFired).toBe(false);
});
