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
  AUTHENTICATE_SENDING,  
  AUTHENTICATE_SUCCESS,
  AUTHENTICATE_ERROR,
  SET_AUTHENTICATION_STATE,  
  CHANGE_PASSWORD,
  CHANGE_EMAIL,  
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
  form:{
    login:{
      email:"",
      password:""
    }
  },
  user:{
    attributes:"",
    attributes:"",
    isSignedIn:false
  },
});

function appReducer(state = initialState, payload) {
  switch (payload.type) {
    case CHANGE_EMAIL:      
        return state          
          .setIn(['form','login', "email"], payload.email)    
    case CHANGE_PASSWORD:      
        return state          
          .setIn(['form','login', "password"], payload.password)        
    case AUTHENTICATE_SUCCESS:   
        return state          
          .setIn(['user', "attributes"], payload.user.data)
          .setIn(['user', "isSignedIn"], true);
    case SET_AUTHENTICATION_STATE:      
        return state          
          .setIn(['user', "isSignedIn"], payload.newAuthState);
    case LOAD_ENTITIES:      
        return state
          .set('loading', true)
          .set('error', false)
          .setIn(['entities', payload.path], false);
    case LOAD_ENTITIES_SUCCESS:
      return state
        .setIn(['entities', payload.path], payload.entities)
        .set('loading', false);
    case LOAD_ENTITIES_ERROR:
      return state
        .set('error', payload.error)
        .set('loading', false);
    default:
      return state;
  }
}

export default appReducer;