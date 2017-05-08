/*
 *
 * ReportEdit actions
 *
 */

 import {
   SAVE,
 } from './constants';

 export function save(data, dueDateIdUnchecked) {
   return {
     type: SAVE,
     data,
     dueDateIdUnchecked,
   };
 }
