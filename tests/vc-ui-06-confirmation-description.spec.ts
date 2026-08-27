import { test, expect } from '../fixtures/auth';
import { readPersonaUser } from '../fixtures/personas';
import { dispatchVoiceIntentEvent } from '../helpers/voice';
import { VoiceConfirmationModal } from '../pages/components/VoiceConfirmationModal';

/** docs/VoiceCommands_TestCases.csv — Automates VC-UI-06. */
test('VC-UI-06 (confirmed gap): the confirmation modal shows only the resolved name/date description — no leave id, date-range, leave-type detail, or raw-transcript-vs-resolved-entity comparison a user could use to catch a bad fuzzy match before confirming', { tag: ['@regression'] }, async ({ adminPage }) => {
  const self = readPersonaUser('employeeSelf');
  test.skip(!self, 'employeeSelf persona not configured.');
  await adminPage.goto('/dashboard');
  const misheardTranscript = 'approve leave for a totally different phrase than what gets shown';
  await dispatchVoiceIntentEvent(adminPage, { transcript: misheardTranscript, intent: 'APPROVE_LEAVE', entities: { user: { id: self!.id, name: self!.name }, date: '2026-09-15' } });
  const modal = new VoiceConfirmationModal(adminPage);
  await modal.waitForOpen();
  await modal.expectDescription(`Approve leave for ${self!.name} on 2026-09-15`);
  await expect(modal.dialog).not.toContainText(misheardTranscript);
  await modal.cancel();
  await modal.expectClosed();
});
