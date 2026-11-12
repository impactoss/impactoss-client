/*
 * SessionWarningModal Messages
 *
 * This contains all the text for the SessionWarningModal component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'app.containers.SessionWarningModal.title',
    defaultMessage: 'Are you still using the {appTitle}?',
  },
  remainingMinutes: {
    id: 'app.containers.SessionWarningModal.remainingMinutes',
    defaultMessage: 'For your security, you will be automatically **signed out in {minutes, plural, one {# minute} other {# minutes}}**. ',
  },
  remainingSeconds: {
    id: 'app.containers.SessionWarningModal.remainingSeconds',
    defaultMessage: 'For your security, you will be automatically **signed out in {seconds, plural, one {# second} other {# seconds}}**. ',
  },
  extendHint: {
    id: 'app.containers.SessionWarningModal.extendHint',
    defaultMessage: 'To remain signed in, continue using the Tracker or select the button below.',
  },
  extendButton: {
    id: 'app.containers.SessionWarningModal.extendButton',
    defaultMessage: 'Stay signed in',
  },
});
