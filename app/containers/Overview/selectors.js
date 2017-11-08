import { createSelector } from 'reselect';

import {
  selectEntitiesWhere,
} from 'containers/App/selectors';

export const selectRecommendationCount = createSelector(
  (state) => selectEntitiesWhere(state, { path: 'recommendations', where: { draft: false } }),
  (entities) => entities.size
);
export const selectSdgtargetCount = createSelector(
  (state) => selectEntitiesWhere(state, { path: 'sdgtargets', where: { draft: false } }),
  (entities) => entities.size
);
export const selectMeasureCount = createSelector(
  (state) => selectEntitiesWhere(state, { path: 'measures', where: { draft: false } }),
  (entities) => entities.size
);
export const selectIndicatorCount = createSelector(
  (state) => selectEntitiesWhere(state, { path: 'indicators', where: { draft: false } }),
  (entities) => entities.size
);
