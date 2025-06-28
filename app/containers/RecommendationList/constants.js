import {
  PUBLISH_STATUSES,
  IS_CURRENT_STATUSES,
  IS_ARCHIVE_STATUSES,
  ARCHIVE_MIN_ROLE,
  SEE_DRAFT_MIN_ROLE,
  SUPPORT_LEVELS,
} from 'themes/config';

export const DEPENDENCIES = [
  'user_roles',
  'measures',
  'users',
  'taxonomies',
  'categories',
  'indicators',
  'recommendations',
  'recommendation_measures',
  'recommendation_categories',
  'recommendation_indicators',
  'measure_categories',
  'frameworks',
  'framework_taxonomies',
];

export const CONFIG = {
  serverPath: 'recommendations',
  clientPath: 'recommendations',
  search: ['reference', 'title', 'description', 'response'],
  downloadCSV: true,
  sorting: [
    {
      attribute: 'id', // proxy for created at
      type: 'number',
      order: 'desc',
    },
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
  frameworks: { // filter by framework
    query: 'fwx',
    key: 'framework_id',
  },
  taxonomies: { // filter by each category
    query: 'cat',
    search: true,
    connectPath: 'recommendation_categories',
    key: 'category_id',
    ownKey: 'recommendation_id',
    defaultGroupAttribute: 'groups_recommendations_default', // used when no framework is set
    // TODO better store in database join table framework_taxonomies
    defaultGroupsByFramework: {
      1: { 1: '1', 2: '2' }, // framework 1 recs are grouped by taxonomies 1 & 2
      2: { 1: '10' }, // framework 1 recs are grouped by taxonomies 1 & 2
      3: { 1: '9' }, // framework 1 recs are grouped by taxonomies 1 & 2
    },
    groupBy: 'framework_id',
    editForFrameworks: true,
  },
  connections: { // filter by associated entity
    query: 'connected',
    options: [
      {
        search: true,
        message: 'entities.measures.plural',
        path: 'measures', // filter by recommendation connection
        clientPath: 'actions', // filter by recommendation connection
        key: 'measure_id',
        connectPath: 'recommendation_measures', // filter by recommendation connection
        ownKey: 'recommendation_id',
        editForFrameworks: true,
        frameworkFilter: 'has_measures',
      },
    ],
  },
  attributes: { // filter by attribute value
    options: [
      {
        search: false,
        message: 'attributes.support_level',
        attribute: 'support_level',
        options: SUPPORT_LEVELS,
        editForFrameworks: true,
        frameworkFilter: 'has_response',
      },
      {
        search: false,
        message: 'attributes.draft',
        attribute: 'draft',
        options: PUBLISH_STATUSES,
        role: SEE_DRAFT_MIN_ROLE,
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
};
