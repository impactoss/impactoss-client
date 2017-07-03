import { PUBLISH_STATUSES } from 'containers/App/constants';

export const FILTERS = {
  search: ['title', 'reference'],
  connectedTaxonomies: { // filter by each category
    query: 'catx',
    search: true,
    connections: [
      {
        path: 'measures', // filter by recommendation connection
        title: 'entities.measures.plural',
        key: 'measure_id',
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
        label: 'entities.measures.plural',
        path: 'measures', // filter by recommendation connection
        key: 'measure_id',
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
      {
        filter: true,
        label: 'attributes.manager_id.indicators',
        attribute: 'manager_id',
        extension: {
          key: 'manager',
          label: 'name',
          without: true,
        },
      },
    ],
  },
};

export const EDITS = {
  connections: { // filter by associated entity
    options: [
      {
        label: 'entities.measures.plural',
        path: 'measures',
        connectPath: 'measure_indicators', // filter by recommendation connection
        key: 'measure_id',
        ownKey: 'indicator_id',
        search: true,
      },
      {
        label: 'entities.sdgtargets.plural',
        path: 'sdgtargets',
        connectPath: 'sdgtarget_indicators', // filter by recommendation connection
        key: 'sdgtarget_id',
        ownKey: 'indicator_id',
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
