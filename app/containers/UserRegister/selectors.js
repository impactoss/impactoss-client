import { createSelector } from '@reduxjs/toolkit';

export const selectDomain = createSelector(
  (state) => state.get('userRegister'),
  (substate) => substate
);
