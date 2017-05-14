import { createSelector } from 'reselect';

/**
 * Direct selector to the userPasswordRecover state domain
 */
const selectUserPasswordRecoverDomain = (state) => state.get('userPasswordRecover');

/**
 * Other specific selectors
 */

/**
 * Default selector used by UserPasswordRecover
 */

const makeUserPasswordRecoverSelector = () => createSelector(
  selectUserPasswordRecoverDomain,
  (substate) => substate.toJS()
);

export default makeUserPasswordRecoverSelector;
export {
  selectUserPasswordRecoverDomain,
};
