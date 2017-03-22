/*
 *
 * RecommendationEdit actions
 *
 */

 import {
   SAVE,
   SAVE_SENDING,
   SAVE_SUCCESS,
   SAVE_ERROR,
 } from './constants';

 export function save(data, id) {
   return {
     type: SAVE,
     data,
     id,
   };
 }

 export function saveSending() {
   return {
     type: SAVE_SENDING,
   };
 }

 export function saveSuccess() {
   return {
     type: SAVE_SUCCESS,
   };
 }

 export function saveError(error) {
   return {
     type: SAVE_ERROR,
     error,
   };
 }
