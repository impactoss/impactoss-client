import { createSelector } from 'reselect';

import {
  selectFWTaxonomiesSorted,
  selectRecommendationsCategorised,
  selectFrameworks,
  selectCategories,
  selectFrameworkTaxonomies,
} from 'containers/App/selectors';

import { prepareTaxonomiesMultiple } from 'utils/entities';
import { qe } from 'utils/quasi-equals';

export const selectDomain = (state) => state.get('measureNew');

export const selectConnectedTaxonomies = createSelector(
  selectFWTaxonomiesSorted,
  selectCategories,
  (taxonomies, categories) => prepareTaxonomiesMultiple(
    taxonomies,
    categories,
    ['tags_recommendations'],
    false,
  ),
);

export const selectRecommendationsByFw = createSelector(
  (state, id) => id, // taxonomy id
  selectFrameworkTaxonomies,
  selectRecommendationsCategorised,
  selectFrameworks,
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
          ),
        );
        return framework.getIn(['attributes', 'has_measures']);
      },
    ).groupBy(
      (r) => r.getIn(['attributes', 'framework_id']).toString(),
    );
  },
);
