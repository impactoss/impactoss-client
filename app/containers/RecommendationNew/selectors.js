import { createSelector } from 'reselect';

import {
  selectCategories,
  selectFWTaxonomiesSorted,
} from 'containers/App/selectors';
import { prepareTaxonomiesMultiple } from 'utils/entities';

export const selectDomain = (state) => state.get('recommendationNew');

export const selectConnectedTaxonomies = createSelector(
  selectFWTaxonomiesSorted,
  selectCategories,
  (taxonomies, categories) => prepareTaxonomiesMultiple(
    taxonomies,
    categories,
    ['tags_measures'],
    false,
  ),
);
