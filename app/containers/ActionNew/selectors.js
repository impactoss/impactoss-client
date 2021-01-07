import { createSelector } from 'reselect';

import {
  selectEntities,
  selectFWTaxonomiesSorted,
  selectRecommendationsCategorised,
  selectFrameworks,
} from 'containers/App/selectors';

import {
  prepareTaxonomiesMultiple,
  attributesEqual,
} from 'utils/entities';

export const selectDomain = createSelector(
  (state) => state.get('measureNew'),
  (substate) => substate.toJS()
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectFWTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) =>
    prepareTaxonomiesMultiple(taxonomies, categories, ['tags_recommendations'], false)
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
    return entities
    .filter((r) => {
      const framework = frameworks.find(
        (fw) =>
          attributesEqual(
            fw.get('id'),
            r.getIn(['attributes', 'framework_id']),
          )
        );
      return framework.getIn(['attributes', 'has_measures']);
    })
      .groupBy(
        (r) => r.getIn(['attributes', 'framework_id']).toString()
      );
  }
);
