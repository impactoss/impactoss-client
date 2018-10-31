import { createSelector } from 'reselect';
import { ENABLE_SDGS } from 'themes/config';

import {
  selectEntitiesWhere,
} from 'containers/App/selectors';

export const selectRecommendationCount = createSelector(
  (state) => selectEntitiesWhere(state, { path: 'recommendations', where: { draft: false } }),
  (entities) => entities.size
);
export const selectSdgtargetCount = ENABLE_SDGS
? createSelector(
  (state) => selectEntitiesWhere(state, { path: 'sdgtargets', where: { draft: false } }),
  (entities) => entities.size
)
: () => 0;
export const selectMeasureCount = createSelector(
  (state) => selectEntitiesWhere(state, { path: 'measures', where: { draft: false } }),
  (entities) => entities.size
);
export const selectIndicatorCount = createSelector(
  (state) => selectEntitiesWhere(state, { path: 'indicators', where: { draft: false } }),
  (entities) => entities.size
);
export const selectRecommendationDraftCount = createSelector(
  (state) => selectEntitiesWhere(state, { path: 'recommendations', where: { draft: true } }),
  (entities) => entities.size
);
export const selectSdgtargetDraftCount = ENABLE_SDGS
? createSelector(
  (state) => selectEntitiesWhere(state, { path: 'sdgtargets', where: { draft: true } }),
  (entities) => entities.size
)
: () => 0;
export const selectMeasureDraftCount = createSelector(
  (state) => selectEntitiesWhere(state, { path: 'measures', where: { draft: true } }),
  (entities) => entities.size
);
export const selectIndicatorDraftCount = createSelector(
  (state) => selectEntitiesWhere(state, { path: 'indicators', where: { draft: true } }),
  (entities) => entities.size
);
