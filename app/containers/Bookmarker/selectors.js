import { createSelector } from 'reselect';

import { selectEntitiesSearchQuery } from 'containers/App/selectors';

export const selectBookmarks = createSelector(
  (state) => selectEntitiesSearchQuery(state, { path: 'bookmarks' }),
  (entities) => entities,
);
