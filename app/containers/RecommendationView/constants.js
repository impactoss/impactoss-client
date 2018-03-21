import { ENABLE_SDGS } from 'themes/config';

export const DEPENDENCIES = ENABLE_SDGS
? [
  'user_roles',
  'recommendations',
  'users',
  'taxonomies',
  'categories',
  'measures',
  'recommendation_measures',
  'recommendation_categories',
  'measure_categories',
  'measure_indicators',
  'indicators',
  'sdgtargets',
  'sdgtarget_measures',
]
: [
  'user_roles',
  'recommendations',
  'users',
  'taxonomies',
  'categories',
  'measures',
  'recommendation_measures',
  'recommendation_categories',
  'measure_categories',
  'measure_indicators',
  'indicators',
];
