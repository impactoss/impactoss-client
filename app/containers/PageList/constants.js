import { PUBLISH_STATUSES } from 'containers/App/constants';
// specify the filter and query  options
export const FILTERS = {
  search: ['title'],
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
