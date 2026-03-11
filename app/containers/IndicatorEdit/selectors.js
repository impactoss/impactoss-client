import { createSelector } from 'reselect';

import { CONTRIBUTOR_MIN_ROLE_ASSIGNED } from 'themes/config';

import {
  selectEntity,
  selectMeasuresCategorised,
  selectRecommendationsCategorised,
  selectFWTaxonomiesSorted,
  selectFrameworks,
  selectMeasureIndicatorsByIndicator,
  selectRecommendationIndicatorsByIndicator,
  selectCategories,
  selectUserRoles,
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
  selectUsers,
  (entity, users) => entitySetUser(entity, users),
);

export const selectMeasures = createSelector(
  (state, id) => id,
  selectMeasuresCategorised,
  selectMeasureIndicatorsByIndicator,
  (id, measures, associations) => entitiesSetAssociated(
    measures,
    associations,
    id,
  ),
);


export const selectConnectedTaxonomies = createSelector(
  selectFWTaxonomiesSorted,
  selectCategories,
  (taxonomies, categories) => prepareTaxonomiesMultiple(
    taxonomies,
    categories,
    ['tags_measures'],
  ),
);

export const selectRecommendationsByFw = createSelector(
  (state, id) => id,
  selectRecommendationsCategorised,
  selectRecommendationIndicatorsByIndicator,
  selectFrameworks,
  (id, recs, associations, frameworks) => {
    const filtered = recs.filter(
      (r) => {
        const framework = frameworks.find(
          (fw) => qe(
            fw.get('id'),
            r.getIn(['attributes', 'framework_id']),
          ),
        );
        return framework.getIn(['attributes', 'has_indicators']);
      },
    );
    return entitiesSetAssociated(
      filtered,
      associations,
      id,
    ).groupBy(
      (r) => r.getIn(['attributes', 'framework_id']).toString(),
    );
  },
);

export const selectUsers = createSelector(
  selectUsers,
  selectUserRoles,
  (entities, associations) => usersByMinimumRole(
    entities,
    associations,
    CONTRIBUTOR_MIN_ROLE_ASSIGNED,
  ),
);
