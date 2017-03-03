/*
 *
 * ActionEdit actions
 *
 */

 import {
   GET_ACTION_BY_ID,
   SET_ACTION_ID,
   SAVE,
   SAVE_SENDING,
   SAVE_SUCCESS,
   SAVE_ERROR,
   UPDATE_ENTITY,
   ACTION_NOT_FOUND,
 } from './constants';

 export function getActionById(id) {
   return {
     type: GET_ACTION_BY_ID,
     id,
   };
 }

 export function setActionId(id) {
   return {
     type: SET_ACTION_ID,
     id,
   };
 }

 export function save(data) {
   return {
     type: SAVE,
     data,
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

 export function updateEntity(data) {
   return {
     type: UPDATE_ENTITY,
     data,
   };
 }

 export function actionNotFound(error) {
   return {
     type: ACTION_NOT_FOUND,
     error,
   };
 }
