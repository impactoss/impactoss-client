import { PUBLISH_STATUSES } from 'containers/App/constants';
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
      attribute: 'id', // proxy for created at
      type: 'number',
      order: 'desc',
    },
    {
      attribute: 'title',
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
  attributes: {  // filter by attribute value
    options: [
      {
        search: false,
        label: 'attributes.draft',
        attribute: 'draft',
        options: PUBLISH_STATUSES,
      },
    ],
  },
};
