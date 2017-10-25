/*
 *
 * UserEdit actions
 *
 */

 import {
   SAVE,
 } from './constants';

 export function save(data, id) {
   console.log('data', data)
   return {
     type: SAVE,
     data,
     id,
   };
 }
