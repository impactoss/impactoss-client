/*
 *
 * UserLogin actions
 *
 */
 import { RESET } from './constants';

 export function reset(data) {
   return {
     type: RESET,
     data,
   };
 }
