import { USER_ROLES, PUBLISH_STATUSES, ACCEPTED_STATUSES } from 'themes/config';

export const DEPENDENCIES = [
  'user_roles',
  'measures',
  'users',
  'taxonomies',
  'categories',
  'recommendations',
  'recommendation_measures',
  'recommendation_categories',
  'measure_categories',
];

export const CONFIG = {
  serverPath: 'recommendations',
  clientPath: 'recommendations',
  search: ['reference', 'title', 'description', 'response'],
  sorting: [
    {
      attribute: 'id', // proxy for created at
      type: 'number',
      order: 'desc',
      default: true,
    },
    {
      attribute: 'reference',
      type: 'string',
      order: 'asc',
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
  taxonomies: { // filter by each category
    query: 'cat',
    search: true,
    connectPath: 'recommendation_categories',
    key: 'category_id',
    ownKey: 'recommendation_id',
    defaultGroupAttribute: 'groups_recommendations_default',
  },
  connections: { // filter by associated entity
    query: 'connected',
    options: [
      {
        search: true,
        message: 'entities.measures.plural',
        path: 'measures', // filter by recommendation connection
        clientPath: 'actions', // filter by recommendation connection
        key: 'measure_id',
        connectPath: 'recommendation_measures', // filter by recommendation connection
        ownKey: 'recommendation_id',
      },
    ],
  },
  attributes: {  // filter by attribute value
    options: [
      {
        search: false,
        message: 'attributes.accepted',
        attribute: 'accepted',
        options: ACCEPTED_STATUSES,
      },
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
