import { createSelector } from 'reselect';
import { List } from 'immutable';

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
  (substate) => substate
);

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'categories', id }),
  (state) => selectEntities(state, 'users'),
  (state) => selectFWTaxonomiesSorted(state),
  (entity, users, taxonomies) => prepareCategory(entity, users, taxonomies)
);

export const selectParentOptions = createSelector(
  (state, id) => selectEntity(state, { path: 'categories', id }),
  (state) => selectEntities(state, 'categories'),
  selectTaxonomies,
  (entity, categories, taxonomies) => {
    if (entity && taxonomies && categories) {
      const taxonomy = taxonomies.find((tax) => attributesEqual(entity.getIn(['attributes', 'taxonomy_id']), tax.get('id')));
      const taxonomyParentId = taxonomy && taxonomy.getIn(['attributes', 'parent_id']);
      return taxonomyParentId
        ? categories.filter(
          (otherCategory) => {
            const otherTaxonomy = taxonomies.find(
              (tax) => attributesEqual(
                otherCategory.getIn(['attributes', 'taxonomy_id']),
                tax.get('id'),
              ),
            );
            return otherTaxonomy
              ? attributesEqual(taxonomyParentId, otherTaxonomy.get('id'))
              : null;
          }
        )
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
      // the category taxonomy
      const taxonomy = taxonomies.find(
        (tax) => attributesEqual(entity.getIn(['attributes', 'taxonomy_id']), tax.get('id')),
      );
      // any parent taxonomies
      return taxonomies.find(
        (tax) => attributesEqual(
          taxonomy.getIn(['attributes', 'parent_id']),
          tax.get('id'),
        ),
      );
    }
    return null;
  }
);
const selectIsParentTaxonomy = createSelector(
  (state, id) => selectEntity(state, { path: 'categories', id }),
  selectTaxonomies,
  (entity, taxonomies) => {
    if (entity && taxonomies) {
      // the category taxonomy
      const taxonomy = taxonomies.find(
        (tax) => attributesEqual(entity.getIn(['attributes', 'taxonomy_id']), tax.get('id')),
      );
      // has any child taxonomies?
      return taxonomies.some(
        (tax) => attributesEqual(
          tax.getIn(['attributes', 'parent_id']),
          taxonomy.get('id'),
        ),
      );
    }
    return false;
  }
);


export const selectUsers = createSelector(
  (state) => selectEntities(state, 'users'),
  (state) => selectEntities(state, 'user_roles'),
  (entities, associations) => usersByRole(entities, associations, USER_ROLES.MANAGER.value)
);

export const selectMeasures = createSelector(
  (state, id) => id,
  (state) => selectMeasuresCategorised(state),
  (state) => selectEntities(state, 'measure_categories'),
  selectIsParentTaxonomy,
  (id, entities, associations, isParent) => isParent
    ? null
    : entitiesSetAssociated(entities, 'measure_id', associations, 'category_id', id)
);

export const selectRecommendationsByFw = createSelector(
  (state, id) => id,
  (state, id) => selectEntity(state, { path: 'categories', id }),
  (state) => selectEntities(state, 'framework_taxonomies'),
  (state) => selectRecommendationsCategorised(state),
  (state) => selectEntities(state, 'recommendation_categories'),
  selectIsParentTaxonomy,
  (id, category, fwTaxonomies, entities, associations, isParent) => {
    if (isParent || !category || !fwTaxonomies || !entities || !associations) {
      return null;
    }
    // framework id for category
    const frameworkIds = fwTaxonomies.reduce(
      (memo, fwt) => attributesEqual(
        fwt.getIn(['attributes', 'taxonomy_id']),
        category.getIn(['attributes', 'taxonomy_id']),
      )
        ? memo.push(fwt.getIn(['attributes', 'framework_id']))
        : memo,
      List(),
    );
    return entitiesSetAssociated(entities, 'recommendation_id', associations, 'category_id', id)
      .filter((r) => frameworkIds.find(
        (fwid) => attributesEqual(fwid, r.getIn(['attributes', 'framework_id']))
      ))
      .groupBy(
        (r) => r.getIn(['attributes', 'framework_id']).toString()
      );
  }
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectFWTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => prepareTaxonomiesMultiple(taxonomies, categories, ['tags_measures', 'tags_recommendations'])
);
