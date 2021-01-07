export const DEPENDENCIES = [
  'user_roles',
  'categories',
  'taxonomies',
  'frameworks',
  'framework_taxonomies',
  'recommendation_categories',
  'recommendations',
  'measure_categories',
  'recommendation_measures',
  'measures',
];

export const TAXONOMY_DEFAULT = 1;

export const SORT_OPTIONS = [
  {
    query: 'title',
    field: 'referenceThenTitle',
    order: 'asc',
    type: 'string',
    default: 'true',
  },
  {
    query: 'measures',
    field: 'measures',
    type: 'number',
    order: 'desc',
  },
  {
    query: 'recommendations',
    field: 'recommendations',
    type: 'number',
    order: 'desc',
  },
];

export const SORT_CHANGE = 'impactoss/CategoryList/SORT_CHANGE';
