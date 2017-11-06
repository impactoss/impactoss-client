import { createSelector } from 'reselect';

/**
 * Direct selector to the recommendationImport state domain
 */
export const selectViewDomain = (state) => state.get('recommendationImport');

export const selectFormData = createSelector(
  selectViewDomain,
  (substate) => substate.get('form').data
    ? substate.get('form').data
    : null
);

const selectPage = createSelector(
  selectViewDomain,
  (substate) => substate.get('page')
);

export const selectErrors = createSelector(
  selectPage,
  (pageState) => pageState.get('errors')
);
export const selectSuccess = createSelector(
  selectPage,
  (pageState) => pageState.get('success')
);

export const selectProgress = createSelector(
  selectPage,
  (pageState) => pageState.get('sending') && pageState.get('sending').size > 0
    ? ((pageState.get('success').size + pageState.get('errors').size) / pageState.get('sending').size) * 100
    : null
);
