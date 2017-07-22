import { PUBLISH_STATUSES } from 'containers/App/constants';

export const DEPENDENCIES = [
  'user_roles',
  'measures',
  'measure_categories',
  'users',
  'taxonomies',
  'categories',
  'recommendations',
  'recommendation_measures',
  'recommendation_categories',
  'sdgtargets',
  'sdgtarget_measures',
  'sdgtarget_categories',
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
    connections: [
      {
        path: 'recommendations', // filter by recommendation connection
        title: 'entities.recommendations.plural',
        key: 'recommendation_id',
      },
      {
        path: 'sdgtargets', // filter by recommendation connection
        title: 'entities.sdgtargets.plural',
        key: 'sdgtarget_id',
      },
    ],
  },
  connections: { // filter by associated entity
    query: 'connected',
    options: [
      {
        search: true,
        label: 'entities.indicators.plural',
        path: 'indicators', // filter by recommendation connection
        key: 'indicator_id',
        expandable: true, // used for omitting from connected counts
        connectPath: 'measure_indicators', // filter by recommendation connection
        ownKey: 'measure_id',
      },
      {
        search: true,
        label: 'entities.recommendations.plural',
        path: 'recommendations', // filter by recommendation connection
        key: 'recommendation_id',
        connectPath: 'recommendation_measures', // filter by recommendation connection
        ownKey: 'measure_id',
      },
      {
        search: true,
        label: 'entities.sdgtargets.plural',
        path: 'sdgtargets', // filter by recommendation connection
        key: 'sdgtarget_id',
        connectPath: 'sdgtarget_measures', // filter by recommendation connection
        ownKey: 'measure_id',
      },
    ],
  },
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
  expandableColumns: [
    {
      label: 'Indicators',
      type: 'indicators',
      clientPath: 'indicators',
      icon: 'indicators',
    },
    {
      label: 'Progress reports',
      type: 'reports',
      clientPath: 'reports',
      icon: 'reminder',
    },
  ],
};
