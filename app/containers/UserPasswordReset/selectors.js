import { createSelector } from 'reselect';

export const selectDomain = createSelector(
  (state) => state.get('userPasswordReset'),
  (substate) => substate.toJS()
);
