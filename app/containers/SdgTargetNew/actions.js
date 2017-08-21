/*
 *
 * SdgTargetNew actions
 *
 */

import {
  SAVE,
} from './constants';

export function save(data) {
  return {
    type: SAVE,
    data,
  };
}
