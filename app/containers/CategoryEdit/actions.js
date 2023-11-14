/*
 *
 * CategoryEdit actions
 *
 */

import {
  SAVE,
} from './constants';

export function save(data, id) {
  return {
    type: SAVE,
    data,
    id,
  };
}
