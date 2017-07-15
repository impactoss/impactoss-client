export const DEPENDENCIES = [
  'users',
  'user_roles',
  'roles',
  'user_categories',
  'categories',
  'taxonomies',
];

export const CONFIG = {
  clientPath: 'users',
  serverPath: 'users',
  search: ['name'],
  taxonomies: { // filter by each category
    query: 'cat',
    search: true,
    connectPath: 'user_categories',
    key: 'category_id',
    ownKey: 'user_id',
  },
  connections: { // filter by associated entity
    query: 'connected',
    options: [
      {
        edit: false,
        search: true,
        label: 'entities.roles.plural',
        path: 'roles', // filter by recommendation connection
        key: 'role_id',
      },
    ],
  },
};
