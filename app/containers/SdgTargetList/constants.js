import { PUBLISH_STATUSES, USER_ROLES } from 'themes/config';

export const DEPENDENCIES = [
  'user_roles',
  'sdgtargets',
  'sdgtarget_categories',
  'users',
  'taxonomies',
  'categories',
  'indicators',
  'sdgtarget_indicators',
  'measures',
  'sdgtarget_measures',
  'measure_categories',
  'due_dates',
  'progress_reports',
];

export const CONFIG = {
  serverPath: 'sdgtargets',
  clientPath: 'sdgtargets',
  search: ['reference', 'title'],
  sorting: [
    {
      attribute: 'id', // proxy for created at
      type: 'number',
      order: 'desc',
    },
    {
      attribute: 'reference',
      type: 'string',
      order: 'asc',
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
  taxonomies: { // filter by each category
    query: 'cat',
    search: true,
    connectPath: 'sdgtarget_categories',
    key: 'category_id',
    ownKey: 'sdgtarget_id',
    defaultGroupAttribute: 'groups_sdgtargets_default',
  },
  connectedTaxonomies: { // filter by each connected category
    query: 'catx',
    search: true,
    exclude: 'tags_sdgtargets',
    connections: [
      {
        path: 'measures',
        message: 'entities.measures.plural',
        key: 'measure_id',
      },
    ],
  },
  connections: { // filter by associated entity
    query: 'connected',
    options: [
      {
        search: true,
        message: 'entities.indicators.plural',
        path: 'indicators',
        key: 'indicator_id',
        expandable: true, // used for omitting from connected counts
        connectPath: 'sdgtarget_indicators',
        ownKey: 'sdgtarget_id',
      },
      {
        search: true,
        message: 'entities.measures.plural',
        path: 'measures',
        clientPath: 'actions',
        key: 'measure_id',
        connectPath: 'sdgtarget_measures',
        ownKey: 'sdgtarget_id',
      },
    ],
  },
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
  expandableColumns: [
    {
      message: 'entities.indicators.plural',
      type: 'indicators',
      clientPath: 'indicators',
      icon: 'indicators',
    },
    {
      message: 'entities.progress_reports.plural',
      type: 'reports',
      clientPath: 'reports',
      icon: 'reminder',
    },
  ],
};
