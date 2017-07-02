import { PUBLISH_STATUSES } from 'containers/App/constants';

export const FILTERS = {
  search: ['title', 'reference'],
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
// const filters = {
//   connectedTaxonomies: { // filter by each category
//     query: 'catx',
//     filter: true,
//     connections: [
//       {
//         path: 'measures', // filter by recommendation connection
//         title: this.context.intl.formatMessage(appMessages.entities.measures.plural),
//         key: 'measure_id',
//         connected: {
//           path: 'measure_indicators',
//           key: 'indicator_id',
//           connected: {
//             path: 'measure_categories',
//             key: 'measure_id',
//             attribute: 'measure_id',
//             whereKey: 'category_id',
//           },
//         },
//       },
//       {
//         path: 'sdgtargets', // filter by recommendation connection
//         title: this.context.intl.formatMessage(appMessages.entities.sdgtargets.plural),
//         key: 'sdgtarget_id',
//         connected: {
//           path: 'sdgtarget_indicators',
//           key: 'indicator_id',
//           connected: {
//             path: 'sdgtarget_categories',
//             key: 'sdgtarget_id',
//             attribute: 'sdgtarget_id',
//             whereKey: 'category_id',
//           },
//         },
//       },
//     ],
//   },
// };
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
