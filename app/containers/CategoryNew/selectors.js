import { createSelector } from 'reselect';
import { List } from 'immutable';

import {
  selectEntity,
  selectEntities,
  selectFWTaxonomiesSorted,
  selectTaxonomies,
  selectRecommendationsCategorised,
  selectMeasuresCategorised,
} from 'containers/App/selectors';

import { USER_ROLES } from 'themes/config';

import {
  usersByRole,
  prepareTaxonomiesMultiple,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';

export const selectDomain = createSelector(
  (state) => state.get('categoryNew'),
  (substate) => substate
);


export const selectParentOptions = createSelector(
  (state, id) => selectEntity(state, { path: 'taxonomies', id }),
  (state) => selectEntities(state, 'categories'),
  selectTaxonomies,
  (taxonomy, categories, taxonomies) => {
    if (taxonomy && taxonomies && categories) {
      const taxonomyParentId = taxonomy.getIn(['attributes', 'parent_id']);
      return taxonomyParentId
        ? categories.filter(
          (otherCategory) => {
            const otherTaxonomy = taxonomies.find(
              (tax) => qe(
                otherCategory.getIn(['attributes', 'taxonomy_id']),
                tax.get('id')
              )
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
  (state, id) => selectEntity(state, { path: 'taxonomies', id }),
  selectTaxonomies,
  (taxonomy, taxonomies) => {
    if (taxonomy && taxonomies) {
      return taxonomies.find(
        (tax) => qe(
          taxonomy.getIn(['attributes', 'parent_id']),
          tax.get('id')
        )
      );
    }
    return null;
  }
);


// all users of role manager
export const selectUsers = createSelector(
  (state) => selectEntities(state, 'users'),
  (state) => selectEntities(state, 'user_roles'),
  (entities, associations) => usersByRole(
    entities,
    associations,
    USER_ROLES.MANAGER.value,
  )
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectFWTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => prepareTaxonomiesMultiple(
    taxonomies,
    categories,
    ['tags_measures', 'tags_recommendations'],
  )
);
const selectIsParentTaxonomy = createSelector(
  (state, id) => selectEntity(state, { path: 'taxonomies', id }),
  selectTaxonomies,
  (taxonomy, taxonomies) => {
    if (taxonomy && taxonomies) {
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

export const selectRecommendationsByFw = createSelector(
  (state, id) => id, // taxonomy id
  (state) => selectEntities(state, 'framework_taxonomies'),
  (state) => selectRecommendationsCategorised(state),
  selectIsParentTaxonomy,
  (id, fwTaxonomies, entities, isParent) => {
    if (isParent || !fwTaxonomies || !entities) {
      return null;
    }
    // framework id for category
    const frameworkIds = fwTaxonomies.reduce(
      (memo, fwt) => qe(
        id,
        fwt.getIn(['attributes', 'taxonomy_id'])
      )
        ? memo.push(fwt.getIn(['attributes', 'framework_id']))
        : memo,
      List(),
    );
    return entities.filter(
      (r) => frameworkIds.find(
        (fwid) => qe(
          fwid,
          r.getIn(['attributes', 'framework_id'])
        )
      )
    ).groupBy(
      (r) => r.getIn(['attributes', 'framework_id']).toString()
    );
  }
);

export const selectMeasures = createSelector(
  (state) => selectMeasuresCategorised(state),
  selectIsParentTaxonomy,
  (entities, isParent) => isParent
    ? null
    : entities
);
