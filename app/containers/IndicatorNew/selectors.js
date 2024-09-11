import { createSelector } from 'reselect';

import {
  selectEntities,
  selectFWTaxonomiesSorted,
  selectRecommendationsCategorised,
  selectFrameworks,
} from 'containers/App/selectors';
import { CONTRIBUTOR_MIN_ROLE_ASSIGNED } from 'themes/config';

import {
  usersByMinimumRole,
  prepareTaxonomiesMultiple,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';

export const selectDomain = (state) => state.get('indicatorNew');

// all users of role contributor
export const selectUsers = createSelector(
  (state) => selectEntities(state, 'users'),
  (state) => selectEntities(state, 'user_roles'),
  (entities, associations) => usersByMinimumRole(
    entities,
    associations,
    CONTRIBUTOR_MIN_ROLE_ASSIGNED,
  )
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectFWTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => prepareTaxonomiesMultiple(
    taxonomies,
    categories,
    ['tags_measures', 'tags_recommendations']
  )
);

export const selectRecommendationsByFw = createSelector(
  (state, id) => id, // taxonomy id
  (state) => selectEntities(state, 'framework_taxonomies'),
  (state) => selectRecommendationsCategorised(state),
  (state) => selectFrameworks(state),
  (id, fwTaxonomies, entities, frameworks) => {
    if (!fwTaxonomies || !entities) {
      return null;
    }
    return entities.filter(
      (r) => {
        const framework = frameworks.find(
          (fw) => qe(
            fw.get('id'),
            r.getIn(['attributes', 'framework_id']),
          )
        );
        return framework.getIn(['attributes', 'has_indicators']);
      }
    ).groupBy(
      (r) => r.getIn(['attributes', 'framework_id']).toString()
    );
  }
);
