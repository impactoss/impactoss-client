import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
  selectRecommendationsCategorised,
  selectFWTaxonomiesSorted,
  selectFWIndicators,
  selectFrameworks,
  selectRecommendationMeasuresByMeasure,
  selectMeasureIndicatorsByMeasure,
  selectMeasureCategoriesByMeasure,
} from 'containers/App/selectors';

import {
  entitiesSetAssociated,
  entitySetUser,
  prepareTaxonomiesAssociated,
  prepareTaxonomiesMultiple,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';
export const selectDomain = createSelector(
  (state) => state.get('measureEdit'),
  (substate) => substate
);

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'measures', id }),
  (state) => selectEntities(state, 'users'),
  (entity, users) => entitySetUser(entity, users)
);
export const selectTaxonomies = createSelector(
  (state, id) => id,
  selectFWTaxonomiesSorted,
  (state) => selectEntities(state, 'categories'),
  selectMeasureCategoriesByMeasure,
  (
    id,
    taxonomies,
    categories,
    associations,
  ) => prepareTaxonomiesAssociated(
    taxonomies,
    categories,
    associations,
    'tags_measures',
    id,
    false,
  )
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectFWTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => prepareTaxonomiesMultiple(
    taxonomies,
    categories,
    ['tags_recommendations'],
    false,
  )
);

export const selectRecommendationsByFw = createSelector(
  (state, id) => id,
  selectRecommendationsCategorised,
  selectRecommendationMeasuresByMeasure,
  selectFrameworks,
  (id, recs, associations, frameworks) => {
    const filtered = recs.filter(
      (r) => {
        const framework = frameworks.find(
          (fw) => qe(
            fw.get('id'),
            r.getIn(['attributes', 'framework_id']),
          )
        );
        return framework.getIn(['attributes', 'has_measures']);
      }
    );
    return entitiesSetAssociated(
      filtered,
      associations,
      id,
    ).groupBy(
      (r) => r.getIn(['attributes', 'framework_id']).toString()
    );
  }
);
export const selectIndicators = createSelector(
  (state, id) => id,
  selectFWIndicators,
  selectMeasureIndicatorsByMeasure,
  (id, indicators, associations) => entitiesSetAssociated(
    indicators,
    associations,
    id,
  )
);
