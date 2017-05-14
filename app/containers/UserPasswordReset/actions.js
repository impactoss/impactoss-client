/*
 *
 * UserLogin actions
 *
 */
 import {
   RESET,
   RESET_PASSWORD_SENDING,
   RESET_PASSWORD_SUCCESS,
   RESET_PASSWORD_ERROR,
 } from './constants';

 export function reset(data) {
   return {
     type: RESET,
     data,
   };
 }
 export function passwordResetSending() {
   return {
     type: RESET_PASSWORD_SENDING,
   };
 }

 export function passwordResetSuccess() {
   return {
     type: RESET_PASSWORD_SUCCESS,
   };
 }

 export function passwordResetError(error) {
   return {
     type: RESET_PASSWORD_ERROR,
     error,
   };
 }
