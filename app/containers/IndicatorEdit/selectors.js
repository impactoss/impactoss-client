import { createSelector } from 'reselect';

import { CONTRIBUTOR_MIN_ROLE_ASSIGNED } from 'themes/config';

import {
  selectEntity,
  selectEntities,
  selectMeasuresCategorised,
  selectRecommendationsCategorised,
  selectFWTaxonomiesSorted,
  selectFrameworks,
  selectMeasureIndicatorsByIndicator,
  selectRecommendationIndicatorsByIndicator,
} from 'containers/App/selectors';

import {
  entitiesSetAssociated,
  entitySetUser,
  usersByMinimumRole,
  prepareTaxonomiesMultiple,
} from 'utils/entities';

import { qe } from 'utils/quasi-equals';

/**
 * Direct selector to the indicatorEdit state domain
 */
export const selectDomain = (state) => state.get('indicatorEdit');

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'indicators', id }),
  (state) => selectEntities(state, 'users'),
  (entity, users) => entitySetUser(entity, users)
);

export const selectMeasures = createSelector(
  (state, id) => id,
  selectMeasuresCategorised,
  selectMeasureIndicatorsByIndicator,
  (id, measures, associations) => entitiesSetAssociated(
    measures,
    associations,
    id,
  )
);


export const selectConnectedTaxonomies = createSelector(
  (state) => selectFWTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => prepareTaxonomiesMultiple(
    taxonomies,
    categories,
    ['tags_measures'],
  )
);

export const selectRecommendationsByFw = createSelector(
  (state, id) => id,
  (state) => selectRecommendationsCategorised(state),
  selectRecommendationIndicatorsByIndicator,
  (state) => selectFrameworks(state),
  (id, recs, associations, frameworks) => {
    const filtered = recs.filter(
      (r) => {
        const framework = frameworks.find(
          (fw) => qe(
            fw.get('id'),
            r.getIn(['attributes', 'framework_id']),
          )
        );
        return framework.getIn(['attributes', 'has_indicators']);
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

export const selectUsers = createSelector(
  (state) => selectEntities(state, 'users'),
  (state) => selectEntities(state, 'user_roles'),
  (entities, associations) => usersByMinimumRole(
    entities,
    associations,
    CONTRIBUTOR_MIN_ROLE_ASSIGNED,
  )
);
