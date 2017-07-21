import { createSelector } from 'reselect';
import { find } from 'lodash/collection';

import {
  selectEntitiesSearchQuery,
  selectSortByQuery,
  selectSortOrderQuery,
} from 'containers/App/selectors';

import { sortEntities } from 'utils/entities';

import { CONFIG } from './constants';

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
  (entities, sort, order) => {
    const sortBy = sort || 'title';
    const sortOption = find(CONFIG.sorting, (option) => option.attribute === sortBy);
    return sortEntities(
      entities,
      order || (sortOption ? sortOption.order : 'asc'),
      sortBy,
      sortOption ? sortOption.type : 'string'
    );
  }
);
