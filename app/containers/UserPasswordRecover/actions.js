/*
 *
 * UserPasswordRecover actions
 *
 */
 import { RECOVER } from './constants';

 export function recover(data) {
   return {
     type: RECOVER,
     data,
   };
 }
