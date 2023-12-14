import { createSelector } from 'reselect';

import {
  selectEntitiesSearchQuery,
  selectSortByQuery,
  selectSortOrderQuery,
} from 'containers/App/selectors';

import { sortEntities, getSortOption } from 'utils/sort';

import { CONFIG } from './constants';

export const selectPathQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('path')
);

// kicks off series of cascading selectors
// 1. selectEntitiesWhere filters by attribute
// 2. selectEntitiesSearchQuery filters by keyword
// 3. selectUsers
export const selectBookmarks = createSelector(
  (state, locationQuery) => selectEntitiesSearchQuery(state, {
    path: 'bookmarks',
    searchAttributes: ['title'],
    locationQuery,
  }),
  selectSortByQuery,
  selectSortOrderQuery,
  (entities, sort, order) => {
    const sortOption = getSortOption(CONFIG.sorting, sort);
    return sortEntities(
      entities,
      order || (sortOption ? sortOption.order : 'desc'),
      sort || (sortOption ? sortOption.attribute : 'id'),
      sortOption ? sortOption.type : 'number'
    );
  }
);
