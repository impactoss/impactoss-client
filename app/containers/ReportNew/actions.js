/*
 *
 * ReportNew actions
 *
 */

import {
  SAVE,
} from './constants';

export function save(data, redirect, redirectWithoutCreatedId) {
  return {
    type: SAVE,
    data,
    redirect,
    redirectWithoutCreatedId,
  };
}
