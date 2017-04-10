import { createSelector } from 'reselect';

/**
 * Direct selector to the userEdit state domain
 */
const selectUserEditDomain = (state) => state.get('userEdit');

/**
 * Other specific selectors
 */

const pageSelector = createSelector(
  selectUserEditDomain,
  (substate) => substate.get('page').toJS()
 );
const formSelector = createSelector(
  selectUserEditDomain,
  (substate) => substate.get('form')
 );


/**
 * Default selector used by UserEdit
 */

const userEditSelect = createSelector(
  selectUserEditDomain,
  (substate) => substate.toJS()
);

export default userEditSelect;
export {
  selectUserEditDomain,
  userEditSelect,
  pageSelector,
  formSelector,
};
