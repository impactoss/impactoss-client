import { USER_ROLES, API } from 'themes/config';

export const DEPENDENCIES = [
  API.USER_ROLES,
  API.USERS,
  API.ROLES,
  API.TAXONOMIES,
  API.CATEGORIES,
  API.USER_CATEGORIES,
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
        query: 'role',
        type: 'user-roles',
        search: false,
        popover: false,
        message: 'entities.roles.single',
        entityType: 'roles',
        path: 'roles', // filter by recommendation connection
        key: 'role_id',
        ownKey: 'user_id',
        connectPath: API.USER_ROLES, // filter by recommendation connection
        single: true,
        labels: Object.values(USER_ROLES),
        adminOnly: true,
      },
    ],
  },
};
