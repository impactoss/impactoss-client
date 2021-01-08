// specify the filter and query  options
export const DEPENDENCIES = ['bookmarks'];

export const UPDATE_QUERY = 'impactoss/BookmarkList/UPDATE_QUERY';
export const RESET_SEARCH_QUERY = 'impactoss/BookmarkList/RESET_SEARCH_QUERY';
export const SORTBY_CHANGE = 'impactoss/BookmarkList/SORTBY_CHANGE';
export const SORTORDER_CHANGE = 'impactoss/BookmarkList/SORTORDER_CHANGE';

export const CONFIG = {
  sorting: [
    {
      attribute: 'id', // proxy for created at
      type: 'number',
      order: 'desc',
      default: true,
    },
    {
      attribute: 'title',
      type: 'string',
      order: 'asc',
    },
    {
      attribute: 'updated_at',
      type: 'date',
      order: 'desc',
    },
  ],
};
