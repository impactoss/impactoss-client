import { USER_ROLES, PUBLISH_STATUSES } from 'themes/config';
// specify the filter and query  options
export const DEPENDENCIES = [
  'user_roles',
  'pages',
];

export const CONFIG = {
  serverPath: 'pages',
  clientPath: 'pages',
  search: ['title'],
  sorting: [
    {
      attribute: 'order',
      type: 'number',
      order: 'asc',
      default: true,
    },
    {
      attribute: 'title',
      type: 'string',
      order: 'asc',
    },
    {
      attribute: 'id', // proxy for created at
      type: 'number',
      order: 'desc',
    },
    {
      attribute: 'updated_at',
      type: 'date',
      order: 'desc',
    },
  ],
  attributes: {  // filter by attribute value
    options: [
      {
        search: false,
        message: 'attributes.draft',
        attribute: 'draft',
        options: PUBLISH_STATUSES,
        role: USER_ROLES.CONTRIBUTOR.value,
      },
    ],
  },
};
