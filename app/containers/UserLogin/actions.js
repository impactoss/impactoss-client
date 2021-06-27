/*
 *
 * UserLogin actions
 *
 */
import { LOGIN } from './constants';

export function login(data) {
  return {
    type: LOGIN,
    data,
  };
}
