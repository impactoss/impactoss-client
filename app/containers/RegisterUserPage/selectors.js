import { createSelector } from 'reselect';

/**
 * Direct selector to the registerUserPage state domain
 */
const selectRegisterUserPageDomain = () => (state) => state.get('registerUserPage');

/**
 * Other specific selectors
 */
const registerCredentialsSelector = createSelector(
  selectRegisterUserPageDomain,
  (substate) => ({
    email: substate.get('email'),
    password: substate.get('password'),
    verify: substate.get('verify'),
  })
);

/**
 * Default selector used by RegisterUserPage
 */

const makeSelectRegisterUserPage = () => createSelector(
  selectRegisterUserPageDomain(),
  (substate) => substate.toJS()
);

export default makeSelectRegisterUserPage;
export {
  registerCredentialsSelector,
  selectRegisterUserPageDomain,
};
