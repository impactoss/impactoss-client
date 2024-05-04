import { USER_ROLES } from 'themes/config';

export const DEPENDENCIES = [
  'user_roles',
  'users',
  'roles',
  'user_categories',
  'categories',
  'taxonomies',
];

export const CONFIG = {
  clientPath: 'users',
  serverPath: 'users',
  search: ['name', 'domain'],
  sublabel: 'domain',
  sorting: [
    {
      attribute: 'id', // proxy for created at
      type: 'number',
      order: 'desc',
    },
    {
      attribute: 'name',
      type: 'string',
      order: 'asc',
      default: true,
    },
    {
      attribute: 'updated_at',
      type: 'date',
      order: 'desc',
    },
  ],
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
        popover: false,
        message: 'entities.roles.single',
        path: 'roles', // filter by recommendation connection
        key: 'role_id',
        labels: Object.values(USER_ROLES),
      },
    ],
  },
};
