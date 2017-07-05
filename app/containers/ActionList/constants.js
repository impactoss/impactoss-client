import { PUBLISH_STATUSES } from 'containers/App/constants';

export const FILTERS = {
  search: ['title'],
  taxonomies: { // filter by each category
    query: 'cat',
    search: true,
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
    options: [
      {
        search: true,
        label: 'entities.indicators.plural',
        path: 'indicators', // filter by recommendation connection
        key: 'indicator_id',
        expandable: true, // used for omitting from connected counts
      },
      {
        search: true,
        label: 'entities.recommendations.plural',
        path: 'recommendations', // filter by recommendation connection
        key: 'recommendation_id',
      },
      {
        search: true,
        label: 'entities.sdgtargets.plural',
        path: 'sdgtargets', // filter by recommendation connection
        key: 'sdgtarget_id',
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
};

export const EDITS = {
  taxonomies: { // edit category
    connectPath: 'measure_categories',
    key: 'category_id',
    ownKey: 'measure_id',
    search: true,
  },
  connections: { // filter by associated entity
    options: [
      {
        label: 'entities.indicators.plural',
        path: 'indicators',
        connectPath: 'measure_indicators', // filter by recommendation connection
        key: 'indicator_id',
        ownKey: 'measure_id',
        search: true,
      },
      {
        label: 'entities.recommendations.plural',
        path: 'recommendations',
        connectPath: 'recommendation_measures', // filter by recommendation connection
        key: 'recommendation_id',
        ownKey: 'measure_id',
        search: true,
      },
      {
        label: 'entities.sdgtargets.plural',
        path: 'sdgtargets',
        connectPath: 'sdgtarget_measures', // filter by recommendation connection
        key: 'sdgtarget_id',
        ownKey: 'measure_id',
        search: true,
      },
    ],
  },
  attributes: {  // edit attribute value
    options: [
      {
        label: 'attributes.draft',
        attribute: 'draft',
        options: PUBLISH_STATUSES,
        search: false,
      },
    ],
  },
};
