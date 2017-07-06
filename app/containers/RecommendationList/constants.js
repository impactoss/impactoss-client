import { PUBLISH_STATUSES, ACCEPTED_STATUSES } from 'containers/App/constants';

export const FILTERS = {
  search: ['reference', 'title'],
  taxonomies: { // filter by each category
    query: 'cat',
    search: true,
  },
  connections: { // filter by associated entity
    query: 'connected',
    options: [
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
        label: 'attributes.accepted',
        attribute: 'accepted',
        options: ACCEPTED_STATUSES,
      },
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
    connectPath: 'recommendation_categories',
    key: 'category_id',
    ownKey: 'recommendation_id',
    search: true,
  },
  connections: { // filter by associated entity
    options: [
      {
        label: 'entities.measures.plural',
        path: 'measures',
        connectPath: 'recommendation_measures', // filter by recommendation connection
        key: 'measure_id',
        ownKey: 'recommendation_id',
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
