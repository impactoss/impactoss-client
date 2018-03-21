import { PUBLISH_STATUSES, USER_ROLES, ENABLE_SDGS } from 'themes/config';

export const DEPENDENCIES = ENABLE_SDGS
? [
  'user_roles',
  'indicators',
  'users',
  'taxonomies',
  'categories',
  'measures',
  'measure_indicators',
  'measure_categories',
  'sdgtargets',
  'sdgtarget_indicators',
  'sdgtarget_categories',
  'due_dates',
  'progress_reports',
]
: [
  'user_roles',
  'indicators',
  'users',
  'taxonomies',
  'categories',
  'measures',
  'measure_indicators',
  'measure_categories',
  'due_dates',
  'progress_reports',
];

export const CONFIG = {
  serverPath: 'indicators',
  clientPath: 'indicators',
  search: ['title', 'reference'],
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
  connectedTaxonomies: { // filter by each category
    query: 'catx',
    search: true,
    exclude: 'tags_indicators',
    connections: ENABLE_SDGS
    ? [
      {
        path: 'measures', // filter by recommendation connection
        message: 'entities.measures.plural',
        key: 'measure_id',
      },
      {
        path: 'sdgtargets', // filter by recommendation connection
        message: 'entities.sdgtargets.plural',
        key: 'sdgtarget_id',
      },
    ]
    : [
      {
        path: 'measures', // filter by recommendation connection
        message: 'entities.measures.plural',
        key: 'measure_id',
      },
    ],
  },
  connections: { // filter by associated entity
    query: 'connected',
    options: ENABLE_SDGS
    ? [
      {
        search: true,
        message: 'entities.measures.plural',
        path: 'measures',
        clientPath: 'actions',
        key: 'measure_id',
        connectPath: 'measure_indicators',
        ownKey: 'indicator_id',
      },
      {
        search: true,
        message: 'entities.sdgtargets.plural',
        path: 'sdgtargets',
        key: 'sdgtarget_id',
        ownKey: 'indicator_id',
        connectPath: 'sdgtarget_indicators',
      },
    ]
    : [
      {
        search: true,
        message: 'entities.measures.plural',
        path: 'measures',
        clientPath: 'actions',
        key: 'measure_id',
        connectPath: 'measure_indicators',
        ownKey: 'indicator_id',
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
      {
        search: false,
        edit: false,
        message: 'attributes.manager_id.indicators',
        attribute: 'manager_id',
        role: USER_ROLES.CONTRIBUTOR.value,
        reference: {
          key: 'manager',
          label: 'name',
          without: true,
        },
      },
    ],
  },
  expandableColumns: [
    {
      message: 'entities.progress_reports.plural',
      type: 'reports',
      clientPath: 'reports',
      icon: 'report',
    },
  ],
};
