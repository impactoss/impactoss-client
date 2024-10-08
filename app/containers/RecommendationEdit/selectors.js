import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
  selectMeasuresCategorised,
  selectFWTaxonomiesSorted,
  selectFWIndicators,
  selectRecommendationMeasuresByRecommendation,
  selectRecommendationCategoriesByRecommendation,
  selectRecommendationIndicatorsByRecommendation,
} from 'containers/App/selectors';

import {
  entitiesSetAssociated,
  entitySetUser,
  prepareTaxonomiesAssociated,
  prepareTaxonomiesMultiple,
} from 'utils/entities';

export const selectDomain = (state) => state.get('recommendationEdit');

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'recommendations', id }),
  (state) => selectEntities(state, 'users'),
  (entity, users) => entitySetUser(entity, users)
);

export const selectTaxonomies = createSelector(
  (state, id) => id,
  selectFWTaxonomiesSorted,
  (state) => selectEntities(state, 'categories'),
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
  )
);

export const selectConnectedTaxonomies = createSelector(
  selectFWTaxonomiesSorted,
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => prepareTaxonomiesMultiple(
    taxonomies,
    categories,
    ['tags_measures'],
    false,
  )
);

export const selectMeasures = createSelector(
  (state, id) => id,
  selectMeasuresCategorised,
  selectRecommendationMeasuresByRecommendation,
  (id, entities, associations) => entitiesSetAssociated(
    entities,
    associations,
    id,
  )
);
export const selectIndicators = createSelector(
  (state, id) => id,
  selectFWIndicators,
  selectRecommendationIndicatorsByRecommendation,
  (id, entities, associations) => entitiesSetAssociated(
    entities,
    associations,
    id,
  )
);
