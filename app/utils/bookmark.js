import messages from 'containers/BookmarkList/messages';

const getEntries = (subView) => (Object.entries(subView)
  .filter(([, value]) => value) // filter out if parameter is not defined
)

const getPath = (type, queryParts) => `/${type}?${queryParts.sort().join('&')}`;

export const bookmarkToPath = (bookmark) => {
  const view = bookmark.getIn(['attributes', 'view']).toJS();

  if (!view.type) {
    return null
  }

  const {
    type,
    subgroup, group, expand, sort, order,
    cat, catx, where, connected,
  } = view;

  const singleValue = getEntries({ subgroup, group, expand, sort, order })
    .map((entry) => entry.join('='));
  const cats = (cat || []).map((id) => `cat=${id}`);
  const multiValue = getEntries({ catx, where, connected })
    .flatMap(
      ([filter, objects]) => objects.map(
        ({ key, value }) => `${filter}=${key}:${value}`
      )
    );

  return getPath(type, [...singleValue, ...cats, ...multiValue]);
}

export const locationToPath = (location) => {
  const {pathname, search} = location.toJS();

  return getPath(pathname.substring(1), search.substring(1).split('&'));
}

// @TODO implement this on bookmark saving
export const pathToBookmarkView = () => null
