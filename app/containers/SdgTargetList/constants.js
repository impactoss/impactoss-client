import { PUBLISH_STATUSES } from 'containers/App/constants';

export const DEPENDENCIES = [
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
  'user_roles',
  'due_dates',
  'progress_reports',
];

export const CONFIG = {
  serverPath: 'sdgtargets',
  clientPath: 'sdgtargets',
  search: ['reference', 'title'],
  taxonomies: { // filter by each category
    query: 'cat',
    search: true,
    connectPath: 'sdgtarget_categories',
    key: 'category_id',
    ownKey: 'sdgtarget_id',
  },
  connectedTaxonomies: { // filter by each connected category
    query: 'catx',
    search: true,
    connections: [
      {
        path: 'measures',
        title: 'entities.measures.plural',
        key: 'measure_id',
      },
    ],
  },
  connections: { // filter by associated entity
    query: 'connected',
    options: [
      {
        search: true,
        label: 'entities.indicators.plural',
        path: 'indicators',
        key: 'indicator_id',
        expandable: true, // used for omitting from connected counts
        connectPath: 'sdgtarget_indicators',
        ownKey: 'sdgtarget_id',
      },
      {
        search: true,
        label: 'entities.measures.plural',
        path: 'measures',
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
