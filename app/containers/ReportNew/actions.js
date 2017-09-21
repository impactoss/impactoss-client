/*
 *
 * ReportNew actions
 *
 */

import {
  SAVE,
} from './constants';

export function save(data, redirect, createAsGuest) {
  return {
    type: SAVE,
    data,
    redirect,
    createAsGuest,
  };
}
