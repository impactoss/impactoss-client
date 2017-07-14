import { createSelector } from 'reselect';

export const selectDomain = createSelector(
  (state) => state.get('pageNew'),
  (substate) => substate.toJS()
);
