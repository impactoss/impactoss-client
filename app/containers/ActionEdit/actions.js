/*
 *
 * ActionEdit actions
 *
 */

 import {
   GET_ENTITIES_AND_ACTION_BY_ID,
   ADD_ACTION_ID,
   GET_ENTITIES_LOADING,
   GET_ENTITIES_SUCCESS,
   GET_ENTITIES_ERROR,
   SAVE,
   SAVE_SENDING,
   SAVE_SUCCESS,
   SAVE_ERROR,
   UPDATE_ENTITY,
 } from './constants';

 export function getEntitiesAndActionById(path, id) {
   return {
     type: GET_ENTITIES_AND_ACTION_BY_ID,
     path,
     id,
   };
 }

 export function addActionId(id) {
   return {
     type: ADD_ACTION_ID,
     id,
   };
 }

 export function getEntitiesLoading() {
   return {
     type: GET_ENTITIES_LOADING,
   };
 }

 export function getEntitiesSuccess() {
   return {
     type: GET_ENTITIES_SUCCESS,
   };
 }

 export function getEntitiesError(error) {
   return {
     type: GET_ENTITIES_ERROR,
     error,
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
