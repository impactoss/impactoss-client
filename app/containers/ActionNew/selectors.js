import { createSelector } from 'reselect';
import { selectEntities, selectTaxonomiesSorted } from 'containers/App/selectors';
import { prepareTaxonomiesMultiple } from 'utils/entities';

export const selectDomain = createSelector(
  (state) => state.get('measureNew'),
  (substate) => substate.toJS()
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) =>
    prepareTaxonomiesMultiple(taxonomies, categories, ['tags_recommendations'], false)
);
