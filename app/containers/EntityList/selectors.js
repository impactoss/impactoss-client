import { createSelector } from 'reselect';

/**
 * Direct selector to the entityList state domain
 */
export const selectEntityListDomain = (state) => state.get('entityList');

export const selectDomain = createSelector(
   selectEntityListDomain,
   (substate) => substate.get('page')
);

export const selectActivePanel = createSelector(
  selectDomain,
  (pageState) => pageState.get('activePanel')
);

export const selectSelectedEntities = createSelector(
  selectDomain,
  (pageState) => pageState.get('entitiesSelected')
);
