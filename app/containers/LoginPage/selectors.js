import { createSelector } from 'reselect';

/**
 * Direct selector to the loginPage state domain
 */
const selectLoginPageDomain = (state) => state.get('loginPage');

/**
 * Other specific selectors
 */
const credentialsSelector = createSelector(
  selectLoginPageDomain,
  (substate) => {
    return {
      email: substate.get('email'),
      password: substate.get('password'),
    };
  }
);

/**
 * Default selector used by LoginPage
 */

const makeSelectLoginPage = () => createSelector(
  selectLoginPageDomain,
  (substate) => substate.toJS()
);

export default makeSelectLoginPage;
export {
  credentialsSelector,
  selectLoginPageDomain,
};
