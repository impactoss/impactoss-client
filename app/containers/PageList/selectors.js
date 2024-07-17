import { createSelector } from '@reduxjs/toolkit';

import {
  selectEntitiesSearchQuery,
  selectSortByQuery,
  selectSortOrderQuery,
} from 'containers/App/selectors';

import { sortEntities, getSortOption } from 'utils/sort';

import { CONFIG } from './constants';

// kicks off series of cascading selectors
// 1. selectEntitiesWhere filters by attribute
// 2. selectEntitiesSearchQuery filters by keyword
// 3. selectUsers
export const selectPages = createSelector(
  (state, locationQuery) => selectEntitiesSearchQuery(state, {
    path: 'pages',
    searchAttributes: CONFIG.search || ['title'],
    locationQuery,
  }),
  selectSortByQuery,
  selectSortOrderQuery,
  (entities, sort, order) => {
    const sortOption = getSortOption(CONFIG.sorting, sort);
    return sortEntities(
      entities,
      order || (sortOption ? sortOption.order : 'asc'),
      sort || (sortOption ? sortOption.attribute : 'order'),
      sortOption ? sortOption.type : 'number'
    );
  }
);
