import { createSelector } from 'reselect';

import {
  selectEntity,
  // selectMeasuresCategorised,
  selectFWTaxonomiesSorted,
  // selectFWIndicators,
  // selectRecommendationMeasuresByRecommendation,
  selectRecommendationCategoriesByRecommendation,
  // selectRecommendationIndicatorsByRecommendation,
  selectCategories,
  selectUsers,
} from 'containers/App/selectors';

import {
  // entitiesSetAssociated,
  entitySetUser,
  prepareTaxonomiesAssociated,
  // prepareTaxonomiesMultiple,
} from 'utils/entities';

export const selectDomain = (state) => state.get('recommendationEdit');

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'recommendations', id }),
  selectUsers,
  (entity, users) => entitySetUser(entity, users),
);

export const selectTaxonomies = createSelector(
  (state, id) => id,
  selectFWTaxonomiesSorted,
  selectCategories,
  selectRecommendationCategoriesByRecommendation,
  (
    id,
    taxonomies,
    categories,
    associations,
  ) => prepareTaxonomiesAssociated(
    taxonomies,
    categories,
    associations,
    'tags_recommendations',
    id,
    false, //  do not include parent taxonomies
  ),
);

// export const selectConnectedTaxonomies = createSelector(
//   selectFWTaxonomiesSorted,
//   selectCategories,
//   (taxonomies, categories) => prepareTaxonomiesMultiple(
//     taxonomies,
//     categories,
//     ['tags_measures'],
//     false,
//   )
// );
//
// // export const selectMeasures = createSelector(
// //   (state, id) => id,
// //   selectMeasuresCategorised,
// //   selectRecommendationMeasuresByRecommendation,
// //   (id, entities, associations) => entitiesSetAssociated(
// //     entities,
// //     associations,
// //     id,
// //   )
// // );
// // export const selectIndicators = createSelector(
// //   (state, id) => id,
// //   selectFWIndicators,
// //   selectRecommendationIndicatorsByRecommendation,
// //   (id, entities, associations) => entitiesSetAssociated(
// //     entities,
// //     associations,
// //     id,
// //   )
// // );
