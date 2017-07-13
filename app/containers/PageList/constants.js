import { PUBLISH_STATUSES } from 'containers/App/constants';
// specify the filter and query  options
export const CONFIG = {
  serverPath: 'pages',
  clientPath: 'pages',
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
