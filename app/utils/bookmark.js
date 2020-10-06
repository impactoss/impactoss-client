import messages from 'containers/BookmarkList/messages';

const getEntries = (subView) => (Object.entries(subView)
  .filter(([, value]) => value) // filter out if parameter is not defined
)

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

  const queryParts = [...singleValue, ...cats, ...multiValue]

  return `/${type}?${queryParts.sort().join('&')}`;
}

export const locationToBookmarkView = (location) => {
  const {pathname, search} = location.toJS();
  const search_parts = search.substring(1)
    .split('&').map(part => decodeURIComponent(part).split('='));
  const singleParams = ['subgroup', 'group', 'expand', 'sort', 'order'];
  const multiParams = ['catx', 'where', 'connected'];

  const singleValues = search_parts
    .filter(([k, v]) => singleParams.includes(k))
    .map(([k, v]) => ({[k]: v}))
    .reduce((acc, v) => ({...acc, ...v}), {})

  const cat = search_parts
    .filter(([k]) => k === 'cat')
    .map(([, v]) => v)

  const multiValues = search_parts
    .filter(([k]) => multiParams.includes(k))
    .map(([param, pair]) => {
      const [key, value] = pair.split(':');

      return {param, key, value};
    })
    .reduce((acc, {param, key, value}) => ({
      ...acc, [param]: [...(acc[param] || {}), {key, value}]
    }), {})

  return {
    type: pathname.substring(1),
    ...singleValues, cat, ...multiValues
  };
}
