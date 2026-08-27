import { test, expect } from '../fixtures/auth';
import { dispatchVoiceIntentEvent } from '../helpers/voice';
import { VoiceConfirmationModal } from '../pages/components/VoiceConfirmationModal';

/** docs/VoiceCommands_TestCases.csv — Automates VC-FN-06 UI half. */
test('VC-FN-06 (UI half): SHOW_TEAM navigates immediately with no confirmation modal and no /voice/execute call', { tag: ['@regression'] }, async ({ managerPage }) => {
  await managerPage.goto('/dashboard');
  let executeCalled = false;
  managerPage.on('request', (request) => { if (request.url().includes('/api/voice/execute')) executeCalled = true; });
  await dispatchVoiceIntentEvent(managerPage, { transcript: 'show team employee list', intent: 'SHOW_TEAM', entities: {} });
  await managerPage.waitForURL(/\/employees/);
  const modal = new VoiceConfirmationModal(managerPage);
  await expect(modal.dialog).not.toBeVisible();
  expect(executeCalled).toBe(false);
});
