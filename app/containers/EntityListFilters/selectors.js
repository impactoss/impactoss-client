import { createSelector } from 'reselect';

/**
 * Direct selector to the actionEdit state domain
 */
const selectEntityListFiltersDomain = (state) => state.get('entityListFilters');

/**
 * Other specific selectors
 */

const formSelector = createSelector(
  selectEntityListFiltersDomain,
  (substate) => substate.get('form')
 );


/**
 * Default selector used by ActionEdit
 */

const entityListSelect = createSelector(
  selectEntityListFiltersDomain,
  (substate) => substate.toJS()
);

export default entityListSelect;
export {
  selectEntityListFiltersDomain,
  entityListSelect,
  formSelector,
};
