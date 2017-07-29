import { createSelector } from 'reselect';

import {
  selectEntities,
} from 'containers/App/selectors';

export const selectRecommendationCount = createSelector(
  (state) => selectEntities(state, 'recommendations'),
  (entities) => entities.size
);
export const selectSdgtargetCount = createSelector(
  (state) => selectEntities(state, 'sdgtargets'),
  (entities) => entities.size
);
export const selectMeasureCount = createSelector(
  (state) => selectEntities(state, 'measures'),
  (entities) => entities.size
);
export const selectIndicatorCount = createSelector(
  (state) => selectEntities(state, 'indicators'),
  (entities) => entities.size
);
