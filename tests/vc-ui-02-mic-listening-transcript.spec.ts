import { test, expect } from '../fixtures/auth';
import { UNKNOWN_TRANSCRIPT } from '../fixtures/voice-data';
import { mockSpeechRecognition } from '../helpers/voice';

/** docs/VoiceCommands_TestCases.csv — Automates VC-UI-02. */
test('VC-UI-02: a real click on the mic, with a (mocked) recognizer active, flips the tooltip to "Stop listening" and shows a live transcript tooltip once a result arrives', { tag: ['@regression'] }, async ({ adminPage }) => {
  await mockSpeechRecognition(adminPage, { finalTranscript: UNKNOWN_TRANSCRIPT });
  await adminPage.goto('/dashboard');
  const micButton = adminPage.getByRole('button', { name: 'Ask the AI assistant' });
  await micButton.waitFor({ state: 'visible' });
  await micButton.click();
  await expect(adminPage.getByRole('button', { name: 'Stop listening' })).toBeVisible();
  await expect(adminPage.getByText(UNKNOWN_TRANSCRIPT)).toBeVisible();
});
