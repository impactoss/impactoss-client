export const DEPENDENCIES = [
  'pages',
  'taxonomies',
  'framework_taxonomies',
  'categories',
  'indicators',
  'measures',
  'recommendations',
  'progress_reports',
  'recommendation_measures',
  'recommendation_indicators',
  'measure_indicators',
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
        // {
        //   path: 'measures',
        //   clientPath: 'actions',
        //   search: ['reference', 'title', 'description', 'outcome'],
        //   sorting: [
        //     {
        //       attribute: 'id', // proxy for created at
        //       type: 'number',
        //       order: 'desc',
        //       default: true,
        //     },
        //     {
        //       attribute: 'title',
        //       type: 'string',
        //       order: 'asc',
        //     },
        //     {
        //       attribute: 'updated_at',
        //       type: 'date',
        //       order: 'desc',
        //     },
        //   ],
        // },
        // {
        //   path: 'indicators',
        //   search: ['reference', 'title', 'description'],
        //   sorting: [
        //     {
        //       attribute: 'id', // proxy for created at
        //       type: 'number',
        //       order: 'desc',
        //       default: true,
        //     },
        //     {
        //       attribute: 'reference',
        //       type: 'string',
        //       order: 'asc',
        //     },
        //     {
        //       attribute: 'title',
        //       type: 'string',
        //       order: 'asc',
        //     },
        //     {
        //       attribute: 'updated_at',
        //       type: 'date',
        //       order: 'desc',
        //     },
        //   ],
        // },
        {
          path: 'recommendations',
          search: ['reference', 'title', 'description'],
          groupByFramework: true,
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
        // {
        //   path: 'progress_reports',
        //   clientPath: 'reports',
        //   search: ['title', 'description', 'document_url'],
        //   sorting: [
        //     {
        //       attribute: 'id', // proxy for created at
        //       type: 'number',
        //       order: 'desc',
        //       default: true,
        //     },
        //     {
        //       attribute: 'title',
        //       type: 'string',
        //       order: 'asc',
        //     },
        //     {
        //       attribute: 'updated_at',
        //       type: 'date',
        //       order: 'desc',
        //     },
        //   ],
        // },
      ],
    },
    {
      group: 'taxonomies',
      search: [{
        attribute: 'title',
        as: 'taxonomy',
      }],
      categorySearch: ['reference', 'title', 'short_title', 'description', 'url', 'taxonomy'],
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
