import { createSelector } from 'reselect';

/**
 * Direct selector to the userPasswordReset state domain
 */
const selectUserPasswordResetDomain = (state) => state.get('userPasswordReset');

/**
 * Other specific selectors
 */

/**
 * Default selector used by UserPasswordReset
 */

const makeUserPasswordResetSelector = () => createSelector(
  selectUserPasswordResetDomain,
  (substate) => substate.toJS()
);

export default makeUserPasswordResetSelector;
export {
  selectUserPasswordResetDomain,
};
