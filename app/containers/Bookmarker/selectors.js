import { createSelector } from 'reselect';
import deepEqual from 'deep-equal'
import { selectEntities, selectLocation } from 'containers/App/selectors';
import { bookmarkToPath, locationToBookmarkView } from 'utils/bookmark'

export const selectBookmark = createSelector(
  (state) => selectEntities(state, 'bookmarks'),
  (state) => selectLocation(state),
  (bookmarks, location) => {
    const currentView = locationToBookmarkView(location)

    return bookmarks.find(
      (bookmark) => deepEqual(
        currentView, bookmark.getIn(['attributes', 'view']).toJS()
      )
    );
  },
);

export const selectNewBookmarkView = createSelector(
  (state) => selectLocation(state),
  (location) => locationToBookmarkView(location),
);
