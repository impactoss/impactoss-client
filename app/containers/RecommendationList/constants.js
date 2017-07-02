import { PUBLISH_STATUSES, ACCEPTED_STATUSES } from 'containers/App/constants';

export const FILTERS = {
  search: ['reference', 'title'],
  attributes: {  // filter by attribute value
    options: [
      {
        filter: false,
        label: 'attributes.accepted',
        attribute: 'accepted',
        options: ACCEPTED_STATUSES,
      },
      {
        filter: false,
        label: 'attributes.draft',
        attribute: 'draft',
        options: PUBLISH_STATUSES,
      },
    ],
  },
  taxonomies: { // filter by each category
    query: 'cat',
    filter: true,
  },
  connections: { // filter by associated entity
    options: [
      {
        filter: true,
        label: 'entities.measures.plural',
        path: 'measures', // filter by recommendation connection
        key: 'measure_id',
      },
    ],
  },
};

export const EDITS = {
  taxonomies: { // edit category
    connectPath: 'recommendation_categories',
    key: 'category_id',
    ownKey: 'recommendation_id',
    filter: true,
  },
  connections: { // filter by associated entity
    options: [
      {
        label: 'entities.measures.plural',
        path: 'measures',
        connectPath: 'recommendation_measures', // filter by recommendation connection
        key: 'measure_id',
        ownKey: 'recommendation_id',
        filter: true,
      },
    ],
  },
  attributes: {  // edit attribute value
    options: [
      {
        label: 'attributes.draft',
        attribute: 'draft',
        options: PUBLISH_STATUSES,
        filter: false,
      },
    ],
  },
};
