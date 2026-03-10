import { createSelector } from 'reselect';
import { selectLocation, selectBookmarks } from 'containers/App/selectors';
import { getBookmarkForLocation } from 'utils/bookmark';

export const selectBookmarkForLocation = createSelector(
  selectBookmarks,
  selectLocation,
  (bookmarks, location) => getBookmarkForLocation(location, bookmarks),
);
