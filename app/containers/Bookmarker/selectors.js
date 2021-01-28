import { createSelector } from 'reselect';
import { selectEntities, selectLocation } from 'containers/App/selectors';
import { getBookmarkForLocation } from 'utils/bookmark';

export const selectBookmarkForLocation = createSelector(
  (state) => selectEntities(state, 'bookmarks'),
  (state) => selectLocation(state),
  (bookmarks, location) => getBookmarkForLocation(location, bookmarks),
);
