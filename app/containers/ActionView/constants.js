import { ENABLE_SDGS } from 'themes/config';

export const DEPENDENCIES = ENABLE_SDGS
? [
  'user_roles',
  'sdgtargets',
  'users',
  'taxonomies',
  'categories',
  'indicators',
  'measures',
  'measure_categories',
  'measure_indicators',
  'sdgtarget_categories',
  'sdgtarget_indicators',
  'sdgtarget_measures',
  'recommendations',
  'recommendation_measures',
  'recommendation_categories',
]
: [
  'user_roles',
  'users',
  'taxonomies',
  'categories',
  'indicators',
  'measures',
  'measure_categories',
  'measure_indicators',
  'recommendations',
  'recommendation_measures',
  'recommendation_categories',
];
