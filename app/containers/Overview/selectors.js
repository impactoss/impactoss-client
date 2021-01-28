import { createSelector } from 'reselect';

import {
  selectRecommendationsWhere,
  selectMeasuresWhere,
  selectIndicatorsWhere,
  // selectEntities,
} from 'containers/App/selectors';

// import { qe } from 'utils/quasi-equals';

export const selectRecommendationCount = createSelector(
  (state) => selectRecommendationsWhere(state, { where: { draft: false } }),
  (entities) => entities && entities
    .groupBy((e) => e.getIn(['attributes', 'framework_id']))
    .map((fwentities) => fwentities.size)
);
// export const selectRecommendationAddressedCount = createSelector(
//   (state) => selectRecommendationsWhere(state, { where: { draft: false } }),
//   (state) => selectMeasuresWhere(state, { where: { draft: false } }),
//   (state) => selectEntities(state, 'recommendation_measures'),
//   (recommendations, measures, associations) =>
//     recommendations && recommendations.filter((rec) => {
//       const recAssociations = associations.filter((association) =>
//         qe(rec.get('id'), association.getIn(['attributes', 'recommendation_id']))
//       );
//       return recAssociations.some((association) =>
//         measures.find((measure) =>
//           qe(measure.get('id'), association.getIn(['attributes', 'measure_id']))
//         )
//       );
//     }).size
// );

export const selectMeasureCount = createSelector(
  (state) => selectMeasuresWhere(state, { where: { draft: false } }),
  (entities) => entities.size
);
export const selectIndicatorCount = createSelector(
  (state) => selectIndicatorsWhere(state, { where: { draft: false } }),
  (entities) => entities.size
);
export const selectRecommendationDraftCount = createSelector(
  (state) => selectRecommendationsWhere(state, { where: { draft: true } }),
  (entities) => entities && entities
    .groupBy((e) => e.getIn(['attributes', 'framework_id']))
    .map((fwentities) => fwentities.size)
);
export const selectMeasureDraftCount = createSelector(
  (state) => selectMeasuresWhere(state, { where: { draft: true } }),
  (entities) => entities.size
);
export const selectIndicatorDraftCount = createSelector(
  (state) => selectIndicatorsWhere(state, { where: { draft: true } }),
  (entities) => entities.size
);
