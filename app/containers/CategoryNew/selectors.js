import { createSelector } from 'reselect';
import { selectEntity, selectEntities, selectFWTaxonomiesSorted, selectTaxonomies } from 'containers/App/selectors';

import { USER_ROLES } from 'themes/config';

import {
  usersByRole,
  prepareTaxonomiesMultiple,
  attributesEqual,
} from 'utils/entities';


export const selectDomain = createSelector(
  (state) => state.get('categoryNew'),
  (substate) => substate.toJS()
);


export const selectParentOptions = createSelector(
  (state, id) => selectEntity(state, { path: 'taxonomies', id }),
  (state) => selectEntities(state, 'categories'),
  selectTaxonomies,
  (taxonomy, categories, taxonomies) => {
    if (taxonomy && taxonomies && categories) {
      const taxonomyParentId = taxonomy.getIn(['attributes', 'parent_id']);
      return taxonomyParentId
        ? categories.filter((otherCategory) => {
          const otherTaxonomy = taxonomies.find((tax) => attributesEqual(otherCategory.getIn(['attributes', 'taxonomy_id']), tax.get('id')));
          return attributesEqual(taxonomyParentId, otherTaxonomy.get('id'));
        })
        : null;
    }
    return null;
  }
);

export const selectParentTaxonomy = createSelector(
  (state, id) => selectEntity(state, { path: 'taxonomies', id }),
  selectTaxonomies,
  (taxonomy, taxonomies) => {
    if (taxonomy && taxonomies) {
      return taxonomies.find((tax) => attributesEqual(taxonomy.getIn(['attributes', 'parent_id']), tax.get('id')));
    }
    return null;
  });


// all users of role manager
export const selectUsers = createSelector(
  (state) => selectEntities(state, 'users'),
  (state) => selectEntities(state, 'user_roles'),
  (entities, associations) =>
    usersByRole(entities, associations, USER_ROLES.MANAGER.value)
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectFWTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) =>
    prepareTaxonomiesMultiple(taxonomies, categories, ['tags_measures', 'tags_recommendations'])
);
