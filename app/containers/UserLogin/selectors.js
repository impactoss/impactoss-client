import { createSelector } from 'reselect';

export const selectDomain = createSelector(
  (state) => state.get('userLogin'),
  (substate) => substate.toJS()
);
