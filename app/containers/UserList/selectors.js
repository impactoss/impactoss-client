import { createSelector } from 'reselect';
import { Map } from 'immutable';

import {
  selectEntities,
  selectEntitiesSearchQuery,
  selectWithoutQuery,
  selectConnectionQuery,
  selectCategoryQuery,
  selectSortByQuery,
  selectSortOrderQuery,
} from 'containers/App/selectors';
import { USER_ROLES } from 'themes/config';

import {
  filterEntitiesByConnection,
  filterEntitiesByCategories,
  filterEntitiesWithoutAssociation,
  attributesEqual,
} from 'utils/entities';

import { sortEntities, getSortOption } from 'utils/sort';

import { CONFIG } from './constants';

const selectUsersNested = createSelector(
  (state, locationQuery) => selectEntitiesSearchQuery(state, {
    path: 'users',
    searchAttributes: ['name'],
    locationQuery,
  }),
  (state) => selectEntities(state, 'user_categories'),
  (state) => selectEntities(state, 'user_roles'),
  (entities, entityCategories, entityRoles) =>
    entities.map((entity) => {
      const entityRoleIds = entityRoles
        .filter((association) => attributesEqual(association.getIn(['attributes', 'user_id']), entity.get('id')))
        .map((association) => association.getIn(['attributes', 'role_id']));
      const entityHighestRoleId = entityRoleIds.reduce((memo, roleId) => roleId < memo ? roleId : memo, USER_ROLES.DEFAULT.value);
      return entity
        .set(
          'categories',
          entityCategories
          .filter((association) => attributesEqual(association.getIn(['attributes', 'user_id']), entity.get('id')))
          .map((association) => association.getIn(['attributes', 'category_id']))
        )
        .set(
          'roles',
          entityHighestRoleId !== USER_ROLES.DEFAULT.value
            ? Map({ 0: entityHighestRoleId })
            : Map()
        );
    })
);
const selectUsersWithout = createSelector(
  selectUsersNested,
  (state) => selectEntities(state, 'categories'),
  selectWithoutQuery,
  (entities, categories, query) => query
    ? filterEntitiesWithoutAssociation(entities, categories, query)
    : entities
);
const selectUsersByConnections = createSelector(
  selectUsersWithout,
  selectConnectionQuery,
  (entities, query) => query
    ? filterEntitiesByConnection(entities, query)
    : entities
);
const selectUsersByCategories = createSelector(
  selectUsersByConnections,
  selectCategoryQuery,
  (entities, query) => query
    ? filterEntitiesByCategories(entities, query)
    : entities
);

// kicks off series of cascading selectors
// 1. selectEntitiesWhere filters by attribute
// 2. selectEntitiesSearchQuery filters by keyword
// 3. selectUsersNested will nest related entities
// 4. selectUsersWithout will filter by absence of taxonomy or connection
// 5. selectUsersByConnections will filter by specific connection
// 6. selectUsersByCategories will filter by specific categories
export const selectUsers = createSelector(
  selectUsersByCategories,
  selectSortByQuery,
  selectSortOrderQuery,
  (entities, sort, order) => {
    const sortOption = getSortOption(CONFIG.sorting, sort);
    return sortEntities(
      entities,
      order || (sortOption ? sortOption.order : 'asc'),
      sort || (sortOption ? sortOption.attribute : 'name'),
      sortOption ? sortOption.type : 'string'
    );
  }
);
