/*
 * UserMfa Constants
 */

import { API } from 'themes/config';

export const DEPENDENCIES = [API.USERS];

export const FORM_INITIAL = {
  password: '',
};

export const ENABLE_MFA = 'impactoss/UserMfa/ENABLE_MFA';
export const DISABLE_MFA = 'impactoss/UserMfa/DISABLE_MFA';
export const SAVE_SENDING = 'impactoss/UserMfa/SAVE_SENDING';
export const SAVE_ERROR = 'impactoss/UserMfa/SAVE_ERROR';
export const SAVE_SUCCESS = 'impactoss/UserMfa/SAVE_SUCCESS';
