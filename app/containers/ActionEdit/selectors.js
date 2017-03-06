import { createSelector } from 'reselect';

/**
 * Direct selector to the actionEdit state domain
 */
const selectActionEditDomain = (state) => state.get('actionEdit');

/**
 * Other specific selectors
 */

const pageSelector = createSelector(
  selectActionEditDomain,
  (substate) => substate.get('page').toJS()
 );


/**
 * Default selector used by ActionEdit
 */

const actionEditSelect = createSelector(
  selectActionEditDomain,
  (substate) => substate.toJS()
);

export default actionEditSelect;
export {
  selectActionEditDomain,
  actionEditSelect,
  pageSelector,
};
