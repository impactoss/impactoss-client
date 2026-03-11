import { createSelector } from 'reselect';
// import { Map } from 'immutable';

import {
  // selectReady,
  selectEntity,
  selectUsers,
  selectCategories,
  // selectMeasureConnections,
  selectTaxonomiesSorted,
  // selectIndicatorConnections,
  // selectFWMeasures,
  // selectFWIndicators,
  // selectRecommendationMeasuresByMeasure,
  // selectMeasureCategoriesByMeasure,
  // selectMeasureIndicatorsByMeasure,
  // selectMeasureIndicatorsByIndicator,
  // selectRecommendationIndicatorsByIndicator,
  // selectRecommendationIndicatorsByRecommendation,
  // selectRecommendationMeasuresByRecommendation,
  selectRecommendationCategoriesByRecommendation,
} from 'containers/App/selectors';

import { qe } from 'utils/quasi-equals';

import {
  entitySetUser,
  filterTaxonomies,
  // getEntityCategories,
} from 'utils/entities';

// import { DEPENDENCIES } from './constants';

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'recommendations', id }),
  selectUsers,
  (entity, users) => entitySetUser(entity, users),
);

export const selectTaxonomies = createSelector(
  (state, id) => id,
  selectTaxonomiesSorted,
  selectCategories,
  selectRecommendationCategoriesByRecommendation,
  (id, taxonomies, categories, associationsGrouped) => {
    if (!taxonomies || !categories || !associationsGrouped) return null;
    const associatedCategoryIds = associationsGrouped.get(parseInt(id, 10));
    const filteredTaxonomies = filterTaxonomies(
      taxonomies,
      'tags_recommendations',
      true,
    ).map(
      (tax) => tax.set('tags', tax.getIn(['attributes', 'tags_recommendations'])),
    );
    return filteredTaxonomies.map(
      (tax) => {
        const childTax = taxonomies.find(
          (potential) => qe(potential.getIn(['attributes', 'parent_id']), tax.get('id')),
        );
        return tax.set(
          'categories',
          categories.filter(
            (cat) => qe(cat.getIn(['attributes', 'taxonomy_id']), tax.get('id')),
          ).filter(
            (cat) => {
              if (
                associatedCategoryIds
                && associatedCategoryIds.some((catId) => qe(catId, cat.get('id')))
              ) {
                return true;
              }
              return childTax && categories.filter(
                (childCat) => qe(childCat.getIn(['attributes', 'taxonomy_id']), childTax.get('id')),
              ).filter(
                (childCat) => qe(childCat.getIn(['attributes', 'parent_id']), cat.get('id')),
              ).some(
                (child) => associatedCategoryIds
                  && associatedCategoryIds.some((catId) => qe(catId, child.get('id'))),
              );
            },
          ),
        );
      },
    );
  },
);

// const selectMeasureAssociations = createSelector(
//   (state, id) => id,
//   selectRecommendationMeasuresByRecommendation,
//   (recommendationId, associations) => associations.get(
//     parseInt(recommendationId, 10),
//   ),
// );
// const selectMeasuresAssociated = createSelector(
//   selectMeasureAssociations,
//   selectFWMeasures,
//   (associations, measures) => associations
//     && associations.reduce(
//       (memo, id) => {
//         const entity = measures.get(id.toString());
//         return entity
//           ? memo.set(id, entity)
//           : memo;
//       },
//       Map(),
//     ),
// );
// // all connected measures
// export const selectMeasures = createSelector(
//   (state) => selectReady(state, { path: DEPENDENCIES }),
//   selectMeasuresAssociated,
//   (state) => selectMeasureConnections(state),
//   selectRecommendationMeasuresByMeasure,
//   selectMeasureCategoriesByMeasure,
//   selectMeasureIndicatorsByMeasure,
//   selectCategories,
//   (
//     ready,
//     measures,
//     connections,
//     measureRecommendations,
//     measureCategories,
//     measureIndicators,
//     categories,
//   ) => {
//     if (!ready) return Map();
//     return measures && measures.map(
//       (measure) => {
//         const entityRecs = measureRecommendations.get(parseInt(measure.get('id'), 10));
//         const entityRecsByFw = entityRecs
//           && connections.get('recommendations')
//           && entityRecs.filter(
//             (recId) => connections.getIn([
//               'recommendations',
//               recId.toString(),
//             ]),
//           ).groupBy(
//             (recId) => connections.getIn([
//               'recommendations',
//               recId.toString(),
//               'attributes',
//               'framework_id',
//             ]).toString(),
//           );
//         return measure.set(
//           'categories',
//           getEntityCategories(
//             measure.get('id'),
//             measureCategories,
//             categories,
//           ),
//         ).set(
//           'indicators',
//           measureIndicators.get(parseInt(measure.get('id'), 10)),
//         // currently needs both
//         ).set(
//           'recommendations',
//           entityRecs,
//         // nest connected recommendation ids byfw
//         ).set(
//           'recommendationsByFw',
//           entityRecsByFw,
//         );
//       },
//     );
//   },
// );
//
// const selectIndicatorAssociations = createSelector(
//   (state, id) => id,
//   selectRecommendationIndicatorsByRecommendation,
//   (recommendationId, associations) => associations.get(
//     parseInt(recommendationId, 10),
//   ),
// );
// const selectIndicatorsAssociated = createSelector(
//   selectIndicatorAssociations,
//   selectFWIndicators,
//   (associations, indicators) => associations
//     && associations.reduce(
//       (memo, id) => {
//         const entity = indicators.get(id.toString());
//         return entity
//           ? memo.set(id, entity)
//           : memo;
//       },
//       Map(),
//     ),
// );
//
// // selectIndicators,
// // selectIndicators,
// export const selectIndicators = createSelector(
//   (state) => selectReady(state, { path: DEPENDENCIES }),
//   selectIndicatorsAssociated,
//   (state) => selectIndicatorConnections(state),
//   selectMeasureIndicatorsByIndicator,
//   selectRecommendationIndicatorsByIndicator,
//   (
//     ready,
//     indicators,
//     connections,
//     indicatorMeasures,
//     indicatorRecs,
//   ) => {
//     if (!ready) return Map();
//     return indicators && indicators.map(
//       (indicator) => {
//         const entityRecs = indicatorRecs.get(parseInt(indicator.get('id'), 10));
//         const entityRecsByFw = entityRecs
//           && connections.get('recommendations')
//           && entityRecs.filter(
//             (recId) => connections.getIn([
//               'recommendations',
//               recId.toString(),
//             ]),
//           ).groupBy(
//             (recId) => connections.getIn([
//               'recommendations',
//               recId.toString(),
//               'attributes',
//               'framework_id',
//             ]).toString(),
//           );
//         return indicator.set(
//           'measures',
//           indicatorMeasures.get(parseInt(indicator.get('id'), 10)),
//           // currently needs both
//         ).set(
//           'recommendations',
//           entityRecs,
//         // nest connected recommendation ids byfw
//         ).set(
//           'recommendationsByFw',
//           entityRecsByFw,
//         );
//       },
//     );
//   },
// );
