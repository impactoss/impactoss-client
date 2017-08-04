import { createSelector } from 'reselect';

export const selectDomain = createSelector(
  (state) => state.get('entityNew'),
  (substate) => substate.toJS()
);
