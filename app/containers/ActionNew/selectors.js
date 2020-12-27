import { createSelector } from 'reselect';
import { selectEntities, selectFWTaxonomiesSorted } from 'containers/App/selectors';
import { prepareTaxonomiesMultiple } from 'utils/entities';

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
