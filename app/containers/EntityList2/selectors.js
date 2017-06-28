import { createSelector } from 'reselect';

/**
 * Direct selector to the actionEdit state domain
 */
const selectEntityListDomain = (state) => state.get('entityList');

/**
 * Other specific selectors
 */

const pageSelector = createSelector(
   selectEntityListDomain,
   (substate) => substate.get('page')
);

const activePanelSelector = createSelector(
  pageSelector,
  (pageState) => pageState.get('activePanel')
);

const entitiesSelectedSelector = createSelector(
  pageSelector,
  (pageState) => pageState.get('entitiesSelected').toJS()
);

/**
 * Default selector used by ActionEdit
 */

const entityListSelect = createSelector(
  selectEntityListDomain,
  (substate) => substate.toJS()
);

export default entityListSelect;
export {
  selectEntityListDomain,
  entityListSelect,
  activePanelSelector,
  entitiesSelectedSelector,
};
