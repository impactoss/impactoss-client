/*
 * UserMfa Messages
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'app.containers.UserMfa.pageTitle',
    defaultMessage: 'Configure Multi-Factor Authentication',
  },
  instructions: {
    id: 'app.containers.UserMfa.instructions',
    defaultMessage:
      'Multi-factor authentication adds an extra layer of security to your account by requiring a code sent to your email in addition to your password when signing in.',
  },
  currentStatus: {
    id: 'app.containers.UserMfa.currentStatus',
    defaultMessage: 'Current Status',
  },
  enabled: {
    id: 'app.containers.UserMfa.enabled',
    defaultMessage: 'Enabled',
  },
  disabled: {
    id: 'app.containers.UserMfa.disabled',
    defaultMessage: 'Disabled',
  },
  enableButton: {
    id: 'app.containers.UserMfa.enableButton',
    defaultMessage: 'Enable MFA',
  },
  disableButton: {
    id: 'app.containers.UserMfa.disableButton',
    defaultMessage: 'Disable MFA',
  },
  enabling: {
    id: 'app.containers.UserMfa.enabling',
    defaultMessage: 'Enabling...',
  },
  disabling: {
    id: 'app.containers.UserMfa.disabling',
    defaultMessage: 'Disabling...',
  },
  passwordRequired: {
    id: 'app.containers.UserMfa.passwordRequired',
    defaultMessage: 'Current password is required to enable or disable MFA',
  },
});
