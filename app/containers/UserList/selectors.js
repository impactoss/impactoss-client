import { createSelector } from 'reselect';
import { Map } from 'immutable';

import {
  selectEntities,
  selectEntitiesSearch,
  selectWithoutQuery,
  selectConnectionQuery,
  selectCategoryQuery,
  selectSortByQuery,
  selectSortOrderQuery,
} from 'containers/App/selectors';

import {
  filterEntitiesByConnection,
  filterEntitiesByCategories,
  filterEntitiesWithoutAssociation,
  attributesEqual,
  sortEntities,
} from 'utils/entities';

export const selectConnections = createSelector(
  (state) => selectEntities(state, 'roles'),
  (roles) => Map().set('roles', roles)
);

const selectUsersNested = createSelector(
  (state, locationQuery) => selectEntitiesSearch(state, {
    path: 'users',
    searchAttributes: ['name'],
    locationQuery,
  }),
  (state) => selectEntities(state, 'user_categories'),
  (state) => selectEntities(state, 'user_roles'),
  (entities, entityCategories, entityRoles) =>
    entities.map((entity) => entity
      .set(
        'categories',
        entityCategories
        .filter((association) => attributesEqual(association.getIn(['attributes', 'user_id']), entity.get('id')))
        .map((association) => association.getIn(['attributes', 'category_id']))
      )
      .set(
        'roles',
        entityRoles
        .filter((association) => attributesEqual(association.getIn(['attributes', 'user_id']), entity.get('id')))
        .map((association) => association.getIn(['attributes', 'role_id']))
      )
    )
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
// 2. selectEntitiesSearch filters by keyword
// 3. selectUsersNested will nest related entities
// 4. selectUsersWithout will filter by absence of taxonomy or connection
// 5. selectUsersByConnections will filter by specific connection
// 6. selectUsersByCategories will filter by specific categories
export const selectUsers = createSelector(
  selectUsersByCategories,
  selectSortByQuery,
  selectSortOrderQuery,
  (entities, sortBy, sortOrder) =>
    sortEntities(entities, sortOrder || 'asc', sortBy || 'name')
);

export const selectTaxonomies = createSelector(
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => taxonomies
    .filter((taxonomy) => taxonomy.getIn(['attributes', 'tags_users']))
    .map((taxonomy) => taxonomy.set(
      'categories',
      categories.filter((category) => attributesEqual(category.getIn(['attributes', 'taxonomy_id']), taxonomy.get('id')))
    ))
);
