import { ENABLE_SDGS } from 'themes/config';

export const DEPENDENCIES = ENABLE_SDGS
? [
  'pages',
  'taxonomies',
  'categories',
  'indicators',
  'measures',
  'recommendations',
  'sdgtargets',
  'progress_reports',
]
: [
  'pages',
  'taxonomies',
  'categories',
  'indicators',
  'measures',
  'recommendations',
  'progress_reports',
];

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
        {
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
        {
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
