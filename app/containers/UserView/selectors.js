import { createSelector } from 'reselect';

import {
  selectEntity,
  selectTaxonomiesSorted,
  selectUserCategoriesByUser,
  selectCategories,
  selectUsers,
  selectUserRoles,
  selectRoles,
} from 'containers/App/selectors';

import {
  entitySetUser,
  filterTaxonomies,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'users', id }),
  selectUsers,
  selectUserRoles,
  selectRoles,
  (entity, users, userRoles, roles) => entity && users && userRoles && roles && entitySetUser(entity, users).set(
    'roles',
    userRoles
      .filter((association) => qe(association.getIn(['attributes', 'user_id']), entity.get('id')))
      .map((association) => roles.find((role) => qe(role.get('id'), association.getIn(['attributes', 'role_id'])))),
  ),
);

export const selectTaxonomies = createSelector(
  (state, id) => id,
  selectTaxonomiesSorted,
  selectCategories,
  selectUserCategoriesByUser,
  (id, taxonomies, categories, associationsGrouped) => {
    if (!taxonomies || !categories || !associationsGrouped) return null;
    const associatedCategoryIds = associationsGrouped.get(parseInt(id, 10));
    const filteredTaxonomies = filterTaxonomies(
      taxonomies,
      'tags_users',
      true,
    ).map(
      (tax) => tax.set('tags', tax.getIn(['attributes', 'tags_users'])),
    );
    return filteredTaxonomies.map(
      (tax) => {
        const childTax = taxonomies.find(
          (potential) => qe(potential.getIn(['attributes', 'parent_id']), tax.get('id')),
        );
        return tax.set(
          'categories',
          categories.filter(
            (cat) => qe(cat.getIn(['attributes', 'taxonomy_id']), tax.get('id')),
          ).filter(
            (cat) => {
              if (
                associatedCategoryIds
                && associatedCategoryIds.some((catId) => qe(catId, cat.get('id')))
              ) {
                return true;
              }
              return childTax && categories.filter(
                (childCat) => qe(childCat.getIn(['attributes', 'taxonomy_id']), childTax.get('id')),
              ).filter(
                (childCat) => qe(childCat.getIn(['attributes', 'parent_id']), cat.get('id')),
              ).some(
                (child) => associatedCategoryIds
                  && associatedCategoryIds.some((catId) => qe(catId, child.get('id'))),
              );
            },
          ),
        );
      },
    );
  },
);
