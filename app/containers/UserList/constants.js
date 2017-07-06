export const FILTERS = {
  search: ['name'],
  taxonomies: { // filter by each category
    query: 'cat',
    search: true,
  },
  connections: { // filter by associated entity
    query: 'connected',
    options: [
      {
        search: true,
        label: 'entities.roles.plural',
        path: 'roles', // filter by recommendation connection
        key: 'role_id',
      },
    ],
  },
};

export const EDITS = {
  taxonomies: { // edit category
    connectPath: 'user_categories',
    key: 'category_id',
    ownKey: 'user_id',
    search: true,
  },
};
