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
  entitiesSetAssociatedCategory,
  prepareTaxonomiesMultiple,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';
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
      const taxonomy = taxonomies.find(
        (tax) => qe(
          entity.getIn(['attributes', 'taxonomy_id']),
          tax.get('id')
        )
      );
      const taxonomyParentId = taxonomy
        && taxonomy.getIn(['attributes', 'parent_id']);
      return taxonomyParentId
        ? categories.filter(
          (otherCategory) => {
            const otherTaxonomy = taxonomies.find(
              (tax) => qe(
                otherCategory.getIn(['attributes', 'taxonomy_id']),
                tax.get('id'),
              ),
            );
            return otherTaxonomy
              ? qe(taxonomyParentId, otherTaxonomy.get('id'))
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
        (tax) => qe(
          entity.getIn(['attributes', 'taxonomy_id']),
          tax.get('id'),
        ),
      );
      // any parent taxonomies
      return taxonomies.find(
        (tax) => qe(
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
        (tax) => qe(
          entity.getIn(['attributes', 'taxonomy_id']),
          tax.get('id'),
        ),
      );
      // has any child taxonomies?
      return taxonomies.some(
        (tax) => qe(
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
  (entities, associations) => usersByRole(
    entities,
    associations,
    USER_ROLES.MANAGER.value,
  )
);

export const selectMeasures = createSelector(
  (state, id) => id,
  selectMeasuresCategorised,
  selectIsParentTaxonomy,
  (id, entities, isParent) => {
    if (isParent) return null;
    return entitiesSetAssociatedCategory(
      entities,
      id,
    );
  }
);

export const selectRecommendationsByFw = createSelector(
  (state, id) => id,
  (state, id) => selectEntity(state, { path: 'categories', id }),
  (state) => selectEntities(state, 'framework_taxonomies'),
  selectRecommendationsCategorised,
  selectIsParentTaxonomy,
  (id, category, fwTaxonomies, entities, isParent) => {
    if (isParent || !category || !fwTaxonomies || !entities) {
      return null;
    }
    // framework id for category
    const frameworkIds = fwTaxonomies.reduce(
      (memo, fwt) => qe(
        fwt.getIn(['attributes', 'taxonomy_id']),
        category.getIn(['attributes', 'taxonomy_id']),
      )
        ? memo.push(fwt.getIn(['attributes', 'framework_id']))
        : memo,
      List(),
    );
    const filtered = entities.filter(
      (r) => frameworkIds.find(
        (fwid) => qe(fwid, r.getIn(['attributes', 'framework_id']))
      )
    );
    return entitiesSetAssociatedCategory(
      filtered,
      id,
    ).groupBy(
      (r) => r.getIn(['attributes', 'framework_id']).toString()
    );
  }
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectFWTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => prepareTaxonomiesMultiple(
    taxonomies,
    categories,
    ['tags_measures', 'tags_recommendations']
  )
);
