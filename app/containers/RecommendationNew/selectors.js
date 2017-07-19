import { createSelector } from 'reselect';

import { selectEntities } from 'containers/App/selectors';
import { prepareTaxonomies } from 'utils/entities';

export const selectDomain = createSelector(
  (state) => state.get('recommendationNew'),
  (substate) => substate.toJS()
);

export const selectTaxonomies = createSelector(
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) =>
    prepareTaxonomies(taxonomies, categories, 'tags_recommendations')
);
