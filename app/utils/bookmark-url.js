import messages from 'containers/BookmarkList/messages';

const getEntries = (subView) => (Object.entries(subView)
  .filter(([, value]) => value) // filter out if parameter is not defined
)

export const bookmarkUrl = {
  decode: (bookmark) => {
    const view = bookmark.getIn(['attributes', 'view']).toJS();

    if (!view.type) {
      throw new Error(messages.invalid);
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

    const queryParts = [...singleValue, ...cats, ...multiValue];

    return `/${type}?${queryParts.join('&')}`;
  },

  encode: (bookmark) => {
  },
}
