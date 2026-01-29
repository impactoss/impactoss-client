import { createSelector } from 'reselect';

export const selectDomain = createSelector(
  (state) => state.get('userMfa'),
  (substate) => substate,
);

export default selectDomain;
