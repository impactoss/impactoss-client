import { ENABLE_SDGS, ENABLE_INDICATORS } from 'themes/config';

let tables = [];
const baseTables = [
  'pages',
  'taxonomies',
  'categories',
  'measures',
  'recommendations',
  'progress_reports',
];
const sdgTables = [
  'sdgtargets',
];
const indicatorTables = [
  'indicators',
];

tables = baseTables;
if (ENABLE_SDGS) {
  tables = tables.concat(sdgTables);
}
if (ENABLE_INDICATORS) {
  tables = tables.concat(indicatorTables);
}
export const DEPENDENCIES = tables;


export const UPDATE_QUERY = 'impactoss/Search/UPDATE_QUERY';
export const RESET_SEARCH_QUERY = 'impactoss/Search/RESET_SEARCH_QUERY';
export const SORTBY_CHANGE = 'impactoss/Search/SORTBY_CHANGE';
export const SORTORDER_CHANGE = 'impactoss/Search/SORTORDER_CHANGE';

export const CONFIG = {
  search: [
    {
      group: 'entities',
      targets: [
        {
          path: 'measures',
          clientPath: 'actions',
          search: ['title', 'description', 'outcome', 'indicator_summary'],
          sorting: [
            {
              attribute: 'id', // proxy for created at
              type: 'number',
              order: 'desc',
              default: true,
            },
            {
              attribute: 'title',
              type: 'string',
              order: 'asc',
            },
            {
              attribute: 'updated_at',
              type: 'date',
              order: 'desc',
            },
          ],
        },
        ENABLE_INDICATORS && {
          path: 'indicators',
          search: ['title', 'description', 'reference'],
          sorting: [
            {
              attribute: 'id', // proxy for created at
              type: 'number',
              order: 'desc',
              default: true,
            },
            {
              attribute: 'reference',
              type: 'string',
              order: 'asc',
            },
            {
              attribute: 'title',
              type: 'string',
              order: 'asc',
            },
            {
              attribute: 'updated_at',
              type: 'date',
              order: 'desc',
            },
          ],
        },
        {
          path: 'recommendations',
          search: ['title', 'description', 'response', 'reference'],
          sorting: [
            {
              attribute: 'id', // proxy for created at
              type: 'number',
              order: 'desc',
              default: true,
            },
            {
              attribute: 'reference',
              type: 'string',
              order: 'asc',
            },
            {
              attribute: 'title',
              type: 'string',
              order: 'asc',
            },
            {
              attribute: 'updated_at',
              type: 'date',
              order: 'desc',
            },
          ],
        },
        ENABLE_SDGS && {
          path: 'sdgtargets',
          search: ['title', 'description', 'reference'],
          sorting: [
            {
              attribute: 'id', // proxy for created at
              type: 'number',
              order: 'desc',
              default: true,
            },
            {
              attribute: 'reference',
              type: 'string',
              order: 'asc',
            },
            {
              attribute: 'title',
              type: 'string',
              order: 'asc',
            },
            {
              attribute: 'updated_at',
              type: 'date',
              order: 'desc',
            },
          ],
        },
        ENABLE_INDICATORS && {
          path: 'progress_reports',
          clientPath: 'reports',
          search: ['title', 'description', 'document_url'],
          sorting: [
            {
              attribute: 'id', // proxy for created at
              type: 'number',
              order: 'desc',
              default: true,
            },
            {
              attribute: 'title',
              type: 'string',
              order: 'asc',
            },
            {
              attribute: 'updated_at',
              type: 'date',
              order: 'desc',
            },
          ],
        },
      ],
    },
    {
      group: 'taxonomies',
      search: [{
        attribute: 'title',
        as: 'taxonomy',
      }],
      categorySearch: ['title', 'short_title', 'description', 'url', 'taxonomy'],
      sorting: [
        {
          attribute: 'reference',
          type: 'string',
          order: 'asc',
          default: true,
        },
        {
          attribute: 'title',
          type: 'string',
          order: 'asc',
        },
        {
          attribute: 'updated_at',
          type: 'date',
          order: 'desc',
        },
      ],
    },
    {
      group: 'content',
      targets: [
        {
          path: 'pages',
          search: ['title', 'content', 'menu_title'],
          sorting: [
            {
              attribute: 'order',
              type: 'number',
              order: 'asc',
              default: true,
            },
            {
              attribute: 'title',
              type: 'string',
              order: 'asc',
            },
            {
              attribute: 'id', // proxy for created at
              type: 'number',
              order: 'desc',
            },
            {
              attribute: 'updated_at',
              type: 'date',
              order: 'desc',
            },
          ],
        },
      ],
    },
  ],
};
