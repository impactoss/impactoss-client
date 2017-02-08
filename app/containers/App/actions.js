/*
 * App Entities
 *
 * Entities change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these entities which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  LOAD_ENTITIES_IF_NEEDED,
  LOAD_ENTITIES,
  LOAD_ENTITIES_SUCCESS,
  LOAD_ENTITIES_ERROR,
} from './constants';

/**
 * Load the entities, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_ENTITIES
 */
export function loadEntitiesIfNeeded(path) {
  return {
    type: LOAD_ENTITIES_IF_NEEDED,
    path: path,
  };
}
/**
 * Load the entities, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_ENTITIES
 */
export function loadEntities(path) {
  return {
    type: LOAD_ENTITIES,
    path:path,
  };
}

/**
 * Dispatched when the entities are loaded by the request saga
 *
 * @param  {array} entities The entities data
 *
 * @return {object}      An action object with a type of LOAD_ENTITIES_SUCCESS passing the entities
 */
export function entitiesLoaded(entities,path) {  
  return {
    type: LOAD_ENTITIES_SUCCESS,
    entities: entities,
    path: path,
  };
}

/**
 * Dispatched when loading the entities fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of LOAD_ENTITIES_ERROR passing the error
 */
export function entitiesLoadingError(error) {
  return {
    type: LOAD_ENTITIES_ERROR,
    error,
  };
}