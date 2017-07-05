import { createSelector } from 'reselect';

import {
  selectEntitiesSearch,
} from 'containers/App/selectors';

// kicks off series of cascading selectors
// 1. selectEntitiesWhere filters by attribute
// 2. selectEntitiesSearch filters by keyword
// 3. selectUsers
export const selectPages = createSelector(
  (state) => selectEntitiesSearch(state, {
    path: 'pages',
    searchAttributes: ['title'],
  }),
  (pages) => pages
);
