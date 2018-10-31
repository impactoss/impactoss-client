import { createSelector } from 'reselect';
import { ENABLE_SDGS } from 'themes/config';
import { selectEntities, selectTaxonomiesSorted } from 'containers/App/selectors';
import { prepareTaxonomiesMultiple } from 'utils/entities';

export const selectDomain = createSelector(
  (state) => state.get('measureNew'),
  (substate) => substate.toJS()
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => ENABLE_SDGS
    ? prepareTaxonomiesMultiple(taxonomies, categories, ['tags_recommendations', 'tags_sdgtargets'])
    : prepareTaxonomiesMultiple(taxonomies, categories, ['tags_recommendations'])
);
