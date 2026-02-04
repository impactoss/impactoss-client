/*
 *
 * UserLogin actions
 *
 */
import { LOGIN, LOGIN_WITH_AZURE, RECOVER } from './constants';

export function login(data) {
  return {
    type: LOGIN,
    data,
  };
}

export function loginWithAzure() {
  return {
    type: LOGIN_WITH_AZURE,
  };
}


export function recover(data) {
  return {
    type: RECOVER,
    data,
  };
}
