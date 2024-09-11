import {
  USER_ROLES,
  PUBLISH_STATUSES,
  IS_CURRENT_STATUSES,
  IS_ARCHIVE_STATUSES,
  ARCHIVE_MIN_ROLE,
  SEE_DRAFT_MIN_ROLE,
} from 'themes/config';

export const DEPENDENCIES = [
  'user_roles',
  'indicators',
  'users',
  'taxonomies',
  'framework_taxonomies',
  'categories',
  'measures',
  'measure_indicators',
  'measure_categories',
  'recommendations',
  'recommendation_indicators',
  'recommendation_categories',
  'recommendation_measures',
  'due_dates',
  'progress_reports',
];

export const CONFIG = {
  serverPath: 'indicators',
  clientPath: 'indicators',
  downloadCSV: true,
  search: ['title', 'reference'],
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
  connectedTaxonomies: { // filter by each category
    query: 'catx',
    search: true,
    connections: [
      {
        path: 'measures', // filter by recommendation connection
        message: 'entities.measures.plural',
        key: 'measure_id',
      },
    ],
  },
  connections: { // filter by associated entity
    query: 'connected',
    options: [
      {
        search: true,
        message: 'entities.measures.plural',
        path: 'measures',
        clientPath: 'actions',
        key: 'measure_id',
        connectPath: 'measure_indicators',
        ownKey: 'indicator_id',
      },
    ],
  },
  attributes: { // filter by attribute value
    options: [
      {
        search: false,
        message: 'attributes.draft',
        attribute: 'draft',
        options: PUBLISH_STATUSES,
        role: SEE_DRAFT_MIN_ROLE,
      },
      {
        search: false,
        edit: false,
        message: 'attributes.manager_id.indicators',
        attribute: 'manager_id',
        role: USER_ROLES.CONTRIBUTOR.value,
        reference: {
          key: 'manager',
          label: 'name',
          sublabel: 'domain',
          without: true,
        },
      },
      {
        search: false,
        message: 'attributes.is_archive',
        attribute: 'is_archive',
        options: IS_ARCHIVE_STATUSES,
        editRole: ARCHIVE_MIN_ROLE,
        forGlobalSettings: [{
          arg: 'loadArchived',
          value: true,
        }],
      },
      {
        search: false,
        edit: false,
        message: 'attributes.is_current',
        attribute: 'is_current',
        options: IS_CURRENT_STATUSES,
        forGlobalSettings: [{
          arg: 'loadNonCurrent',
          value: true,
        }],
      },
    ],
  },
  expandableColumns: [
    {
      message: 'entities.progress_reports.plural',
      type: 'reports',
      clientPath: 'reports',
      icon: 'report',
    },
  ],
};
