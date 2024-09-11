/*
 *
 * UserLogin actions
 *
 */
import { LOGIN, LOGIN_WITH_AZURE } from './constants';

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
