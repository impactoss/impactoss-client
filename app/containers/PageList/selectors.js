import { createSelector } from 'reselect';

import {
  selectEntitiesSearch,
  selectSortByQuery,
  selectSortOrderQuery,
} from 'containers/App/selectors';

import { sortEntities } from 'utils/entities';


// kicks off series of cascading selectors
// 1. selectEntitiesWhere filters by attribute
// 2. selectEntitiesSearch filters by keyword
// 3. selectUsers
export const selectPages = createSelector(
  (state) => selectEntitiesSearch(state, {
    path: 'pages',
    searchAttributes: ['title'],
  }),
  selectSortByQuery,
  selectSortOrderQuery,
  (entities, sortBy, sortOrder) =>
    sortEntities(entities, sortOrder || 'asc', sortBy || 'title')
);
