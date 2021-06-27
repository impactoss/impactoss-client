import { createSelector } from 'reselect';

/**
 * Direct selector to the UserPassword state domain
 */
const selectUserPasswordDomain = () => (state) => state.get('userPassword');

/**
 * Other specific selectors
 */


/**
 * Default selector used by UserPassword
 */

const userPasswordSelector = createSelector(
  selectUserPasswordDomain(),
  (substate) => substate
);

export default userPasswordSelector;
export {
  selectUserPasswordDomain,
};
