import { PUBLISH_STATUSES } from 'containers/App/constants';

export const CONFIG = {
  serverPath: 'measures',
  clientPath: 'actions',
  search: ['title'],
  taxonomies: { // filter by each category
    query: 'cat',
    search: true,
    connectPath: 'measure_categories',
    key: 'category_id',
    ownKey: 'measure_id',
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
