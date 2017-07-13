import { createSelector } from 'reselect';

import {
  selectEntitiesSearchQuery,
  selectSortByQuery,
  selectSortOrderQuery,
} from 'containers/App/selectors';

import { sortEntities } from 'utils/entities';


// kicks off series of cascading selectors
// 1. selectEntitiesWhere filters by attribute
// 2. selectEntitiesSearchQuery filters by keyword
// 3. selectUsers
export const selectPages = createSelector(
  (state, locationQuery) => selectEntitiesSearchQuery(state, {
    path: 'pages',
    searchAttributes: ['title'],
    locationQuery,
  }),
  selectSortByQuery,
  selectSortOrderQuery,
  (entities, sortBy, sortOrder) =>
    sortEntities(entities, sortOrder || 'asc', sortBy || 'title')
);
