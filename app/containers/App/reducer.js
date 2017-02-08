/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import { fromJS } from 'immutable';

import {
  LOAD_ENTITIES,
  LOAD_ENTITIES_SUCCESS,  
  LOAD_ENTITIES_ERROR,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  loading: false,
  error: false,
  entities: {
    actions: false,
    recommendations: false,
    recommendation_actions: false,    
  },
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_ENTITIES:      
        return state
          .set('loading', true)
          .set('error', false)
          .setIn(['entities', action.path], false);
    case LOAD_ENTITIES_SUCCESS:
      return state
        .setIn(['entities', action.path], action.entities)
        .set('loading', false);
    case LOAD_ENTITIES_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    default:
      return state;
  }
}

export default appReducer;