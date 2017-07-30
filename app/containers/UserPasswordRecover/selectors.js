import { createSelector } from 'reselect';

export const selectDomain = createSelector(
  (state) => state.get('userPasswordRecover'),
  (substate) => substate.toJS()
);
