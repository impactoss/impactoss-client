import { PUBLISH_STATUSES } from 'containers/App/constants';

export const FILTERS = {
  search: ['reference', 'title'],
  taxonomies: { // filter by each category
    query: 'cat',
    search: true,
  },
  connections: { // filter by associated entity
    options: [
      {
        search: true,
        label: 'entities.indicators.plural',
        path: 'indicators', // filter by recommendation connection
        key: 'indicator_id',
      },
      {
        search: true,
        label: 'entities.measures.plural',
        path: 'measures', // filter by recommendation connection
        key: 'measure_id',
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
// connectedTaxonomies: { // filter by each category
//   query: 'catx',
//   filter: true,
//   connections: [
//     {
//       path: 'measures', // filter by recommendation connection
//       title: this.context.intl.formatMessage(appMessages.entities.measures.plural),
//       key: 'measure_id',
//       connected: {
//         path: 'measure_indicators',
//         key: 'indicator_id',
//         connected: {
//           path: 'measure_categories',
//           key: 'measure_id',
//           attribute: 'measure_id',
//           whereKey: 'category_id',
//         },
//       },
//     },
//   ],
// },
export const EDITS = {
  taxonomies: { // edit category
    connectPath: 'sdgtarget_categories',
    key: 'category_id',
    ownKey: 'sdgtarget_id',
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
        label: 'entities.measures.plural',
        path: 'measures',
        connectPath: 'sdgtarget_measures', // filter by recommendation connection
        key: 'measure_id',
        ownKey: 'sdgtarget_id',
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
