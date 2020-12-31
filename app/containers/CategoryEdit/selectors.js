import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
  selectMeasuresCategorised,
  selectRecommendationsCategorised,
  selectFWTaxonomiesSorted,
  selectTaxonomies,
} from 'containers/App/selectors';

import { USER_ROLES } from 'themes/config';

import {
  prepareCategory,
  usersByRole,
  entitiesSetAssociated,
  prepareTaxonomiesMultiple,
  attributesEqual,
} from 'utils/entities';

export const selectDomain = createSelector(
  (state) => state.get('categoryEdit'),
  (substate) => substate.toJS()
);

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'categories', id }),
  (state) => selectEntities(state, 'users'),
  (state) => selectFWTaxonomiesSorted(state),
  (entity, users, taxonomies) => prepareCategory(entity, users, taxonomies));

export const selectParentOptions = createSelector(
  (state, id) => selectEntity(state, { path: 'categories', id }),
  (state) => selectEntities(state, 'categories'),
  selectTaxonomies,
  (entity, categories, taxonomies) => {
    if (entity && taxonomies && categories) {
      const taxonomy = taxonomies.find((tax) => attributesEqual(entity.getIn(['attributes', 'taxonomy_id']), tax.get('id')));
      const taxonomyParentId = taxonomy && taxonomy.getIn(['attributes', 'parent_id']);
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
  (state, id) => selectEntity(state, { path: 'categories', id }),
  selectTaxonomies,
  (entity, taxonomies) => {
    if (entity && taxonomies) {
      const taxonomy = taxonomies.find((tax) => attributesEqual(entity.getIn(['attributes', 'taxonomy_id']), tax.get('id')));
      return taxonomies.find((tax) => attributesEqual(taxonomy.getIn(['attributes', 'parent_id']), tax.get('id')));
    }
    return null;
  });


export const selectUsers = createSelector(
  (state) => selectEntities(state, 'users'),
  (state) => selectEntities(state, 'user_roles'),
  (entities, associations) =>
    usersByRole(entities, associations, USER_ROLES.MANAGER.value)
);

export const selectMeasures = createSelector(
  (state, id) => id,
  (state) => selectMeasuresCategorised(state),
  (state) => selectEntities(state, 'measure_categories'),
  (id, entities, associations) =>
    entitiesSetAssociated(entities, 'measure_id', associations, 'category_id', id)
);

export const selectRecommendations = createSelector(
  (state, id) => id,
  (state) => selectRecommendationsCategorised(state),
  (state) => selectEntities(state, 'recommendation_categories'),
  (id, entities, associations) =>
    entitiesSetAssociated(entities, 'recommendation_id', associations, 'category_id', id)
    .groupBy(
      (r) => r.getIn(['attributes', 'framework_id']).toString()
    )
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectFWTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) =>
    prepareTaxonomiesMultiple(taxonomies, categories, ['tags_measures', 'tags_recommendations'])
);
