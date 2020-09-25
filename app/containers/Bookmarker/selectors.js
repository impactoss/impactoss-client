import { createSelector } from 'reselect';
import { selectEntities, selectLocation } from 'containers/App/selectors';
import { bookmarkToPath, locationToPath } from 'utils/bookmark'

export const selectBookmark = createSelector(
  (state) => selectEntities(state, 'bookmarks'),
  (state) => selectLocation(state),
  (bookmarks, location) => {
    const locationPath = locationToPath(location);

    return bookmarks.find(
      (bookmark) => bookmarkToPath(bookmark) === locationPath
    );
  }
);
