import { List } from 'immutable';

const EXCLUDES = [
  'order',
  'sort',
  'items',
  'page',
];

const getPathFromLocation = (location) => location.get('pathname').replace('/', '');

const getBookmarksForPath = (bookmarks, path) => bookmarks.filter(
  (b) => b.getIn(['attributes', 'view', 'path']) === path,
);

const filterQueryForChecking = (query) => List(EXCLUDES).reduce(
  (memo, arg) => memo.delete(arg),
  query,
);
const filterQueryForSaving = (query) => List(EXCLUDES).reduce(
  (memo, arg) => memo.delete(arg),
  query,
);

const checkValues = (valueCheck, value) => {
  if (List.isList(valueCheck) && List.isList(value)) {
    return valueCheck.isSubset(value)
      && valueCheck.isSuperset(value);
  } if (List.isList(valueCheck) && !List.isList(value)) {
    return false;
  } if (!List.isList(valueCheck) && List.isList(value)) {
    return false;
  }
  return valueCheck === value;
};

export const getBookmarkForLocation = (location, bookmarks) => {
  const pathCheck = getPathFromLocation(location);
  const queryCheck = filterQueryForChecking(location.get('query'));

  const bmForType = getBookmarksForPath(bookmarks, pathCheck);

  return bmForType.find(
    (bookmark) => {
      const queryBM = bookmark.getIn(['attributes', 'view', 'query']);
      return queryCheck.every(
        (valueCheck, key) => checkValues(valueCheck, queryBM.get(key))
      )
        && queryBM.every(
          (valueCheck, key) => checkValues(valueCheck, queryCheck.get(key))
        );
    }
  );
};

export const getBookmarkForSaving = (location, type) => {
  const query = filterQueryForSaving(location.get('query'));
  const typeOrPath = type || getPathFromLocation(location);
  return {
    type: typeOrPath === 'actions' ? 'measures' : typeOrPath,
    path: getPathFromLocation(location),
    query: query.toJS(),
  };
};

export const generateBookmarkTitle = (location, bookmarks, viewTitle) => {
  const path = getPathFromLocation(location);
  const count = getBookmarksForPath(bookmarks, path).size;
  return `${viewTitle} ${count + 1}`;
};
