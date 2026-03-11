import { createSelector } from 'reselect';

/**
 * Direct selector to the indicatorImport state domain
 */
export const selectViewDomain = (state) => state.get('indicatorImport');

const selectPage = createSelector(
  selectViewDomain,
  (substate) => substate.get('page'),
);

export const selectErrors = createSelector(
  selectPage,
  (pageState) => pageState.get('errors'),
);
export const selectSuccess = createSelector(
  selectPage,
  (pageState) => pageState.get('success'),
);

export const selectProgress = createSelector(
  selectPage,
  (pageState) => {
    const sending = pageState.get('sending');
    if (!sending || sending.size === 0) return null;
    const errors = pageState.get('errors').filter((e) => e.error.type !== 'client-error');
    return ((pageState.get('success').size + errors.size) / sending.size) * 100;
  },
);
