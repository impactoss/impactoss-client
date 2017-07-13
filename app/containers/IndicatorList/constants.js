import { PUBLISH_STATUSES } from 'containers/App/constants';

export const CONFIG = {
  serverPath: 'indicators',
  clientPath: 'indicators',
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
    query: 'connected',
    options: [
      {
        search: true,
        label: 'entities.measures.plural',
        path: 'measures',
        key: 'measure_id',
        connectPath: 'measure_indicators',
        ownKey: 'indicator_id',
      },
      {
        search: true,
        label: 'entities.sdgtargets.plural',
        path: 'sdgtargets',
        key: 'sdgtarget_id',
        ownKey: 'indicator_id',
        connectPath: 'sdgtarget_indicators',
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
      // {
      //   edit: false,
      //   filter: true,
      //   label: 'attributes.manager_id.indicators',
      //   attribute: 'manager_id',
      //   extension: {
      //     key: 'manager',
      //     label: 'name',
      //     without: true,
      //   },
      // },
    ],
  },
  expandableColumns: [
    {
      label: 'Progress reports',
      type: 'reports',
      clientPath: 'reports',
      icon: 'reminder',
    },
  ],
};
