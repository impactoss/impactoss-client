import { createSelector } from 'reselect';

import {
  selectEntities,
  selectFWTaxonomiesSorted,
} from 'containers/App/selectors';
import { prepareTaxonomiesMultiple } from 'utils/entities';

export const selectDomain = (state) => state.get('recommendationNew');

export const selectConnectedTaxonomies = createSelector(
  (state) => selectFWTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => prepareTaxonomiesMultiple(
    taxonomies,
    categories,
    ['tags_measures'],
    false,
  )
);
