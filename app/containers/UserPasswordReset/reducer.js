/*
 *
 * UserPasswordReset reducer
 *
 */

import { fromJS } from 'immutable';
// import { checkErrorMessagesExist } from 'utils/request';

import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';

// const initialState = fromJS({});
// function userLoginReducer(state = initialState, action) {
//   switch (action.type) {
//     default:
//       return state;
//   }
// }

const formData = fromJS({
  email: '',
});

export default combineReducers({
  form: combineForms({
    data: formData,
  }, 'userPasswordReset.form'),
});
