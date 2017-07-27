import { createSelector } from 'reselect';

export const selectDomain = createSelector(
  (state) => state.get('userRegister'),
  (substate) => substate.toJS()
);
