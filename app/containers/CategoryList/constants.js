import { ENABLE_SDGS } from 'themes/config';

export const DEPENDENCIES = ENABLE_SDGS
? [
  'user_roles',
  'categories',
  'taxonomies',
  'recommendation_categories',
  'recommendations',
  'measure_categories',
  'recommendation_measures',
  'measures',
  'sdgtarget_categories',
  'sdgtarget_measures',
  'sdgtargets',
]
: [
  'user_roles',
  'categories',
  'taxonomies',
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
  {
    query: 'sdgtargets',
    field: 'sdgtargets',
    type: 'number',
    order: 'desc',
  },
];

export const SORT_CHANGE = 'impactoss/CategoryList/SORT_CHANGE';
