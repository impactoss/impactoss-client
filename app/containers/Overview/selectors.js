import { createSelector } from 'reselect';

import {
  selectRecommendationsWhere,
  selectMeasuresWhere,
  selectIndicatorsWhere,
  // selectEntities,
} from 'containers/App/selectors';

// import { qe } from 'utils/quasi-equals';


const WHERE_NOT_DRAFT = { where: { draft: false } };
const WHERE_DRAFT = { where: { draft: true } };

export const selectRecommendationCount = createSelector(
  (state) => selectRecommendationsWhere(state, WHERE_NOT_DRAFT),
  (entities) => entities && entities
    .groupBy((e) => e.getIn(['attributes', 'framework_id']))
    .map((fwentities) => fwentities.size),
);
// export const selectRecommendationAddressedCount = createSelector(
//   (state) => selectRecommendationsWhere(state, WHERE_NOT_DRAFT),
//   (state) => selectMeasuresWhere(state, WHERE_NOT_DRAFT),
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
  (state) => selectMeasuresWhere(state, WHERE_NOT_DRAFT),
  (entities) => entities && entities.size,
);
export const selectIndicatorCount = createSelector(
  (state) => selectIndicatorsWhere(state, WHERE_NOT_DRAFT),
  (entities) => entities && entities.size,
);
export const selectRecommendationDraftCount = createSelector(
  (state) => selectRecommendationsWhere(state, WHERE_DRAFT),
  (entities) => entities && entities
    .groupBy((e) => e.getIn(['attributes', 'framework_id']))
    .map((fwentities) => fwentities.size),
);
export const selectMeasureDraftCount = createSelector(
  (state) => selectMeasuresWhere(state, WHERE_DRAFT),
  (entities) => entities && entities.size,
);
export const selectIndicatorDraftCount = createSelector(
  (state) => selectIndicatorsWhere(state, WHERE_DRAFT),
  (entities) => entities && entities.size,
);
