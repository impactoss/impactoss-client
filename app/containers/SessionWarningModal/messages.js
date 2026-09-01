/*
 * SessionWarningModal Messages
 *
 * This contains all the text for the SessionWarningModal component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'app.containers.SessionWarningModal.title',
    defaultMessage: 'Your session is about to expire',
  },
  remainingMinutes: {
    id: 'app.containers.SessionWarningModal.remainingMinutes',
    defaultMessage: 'You will be automatically logged out in {minutes, plural, one {# minute} other {# minutes}}. ',
  },
  remainingSeconds: {
    id: 'app.containers.SessionWarningModal.remainingSeconds',
    defaultMessage: 'You will be automatically logged out in {seconds, plural, one {# second} other {# seconds}}. ',
  },
  extendHint: {
    id: 'app.containers.SessionWarningModal.extendHint',
    defaultMessage: 'Any activity will keep you signed in, or use the button below.',
  },
  extendButton: {
    id: 'app.containers.SessionWarningModal.extendButton',
    defaultMessage: 'Stay signed in',
  },
});
