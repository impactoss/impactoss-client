import { USER_ROLES, PUBLISH_STATUSES } from 'themes/config';

export const DEPENDENCIES = [
  'user_roles',
  'measures',
  'measure_categories',
  'users',
  'taxonomies',
  'framework_taxonomies',
  'categories',
  'recommendations',
  'recommendation_measures',
  'recommendation_categories',
  'indicators',
  'measure_indicators',
  'due_dates',
  'progress_reports',
];

export const CONFIG = {
  serverPath: 'measures',
  clientPath: 'actions',
  search: ['title'],
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
      attribute: 'target_date',
      type: 'date',
      order: 'desc',
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
    connectPath: 'measure_categories',
    key: 'category_id',
    ownKey: 'measure_id',
    defaultGroupAttribute: 'groups_measures_default',
  },
  connectedTaxonomies: { // filter by each category
    query: 'catx',
    search: true,
    exclude: 'tags_measures',
    connections: [
      {
        path: 'recommendations', // filter by recommendation connection
        message: 'entities.recommendations.plural',
        key: 'recommendation_id',
      },
    ],
  },
  connections: { // filter by associated entity
    query: 'connected',
    options: [
      {
        search: true,
        message: 'entities.indicators.plural',
        path: 'indicators', // filter by recommendation connection
        key: 'indicator_id',
        expandable: true, // used for omitting from connected counts
        connectPath: 'measure_indicators', // filter by recommendation connection
        ownKey: 'measure_id',
      },
      {
        search: true,
        message: 'entities.recommendations_{fwid}.plural',
        path: 'recommendations', // filter by recommendation connection
        key: 'recommendation_id',
        connectPath: 'recommendation_measures', // filter by recommendation connection
        ownKey: 'measure_id',
        groupByFramework: true,
        frameworkFilter: 'has_measures',
      },
    ],
  },
  attributes: { // filter by attribute value
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
      icon: 'report',
    },
  ],
};
