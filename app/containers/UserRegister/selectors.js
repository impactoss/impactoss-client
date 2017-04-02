import { createSelector } from 'reselect';

/**
 * Direct selector to the userRegister state domain
 */
const selectUserRegisterDomain = () => (state) => state.get('userRegister');

/**
 * Other specific selectors
 */


/**
 * Default selector used by UserRegister
 */

const userRegisterSelector = createSelector(
  selectUserRegisterDomain(),
  (substate) => substate.toJS()
);

export default userRegisterSelector;
export {
  selectUserRegisterDomain,
};
