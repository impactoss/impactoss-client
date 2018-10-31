/*
 *
 * CategoryView constants
 *
 */
import { ENABLE_SDGS } from 'themes/config';

export const DEPENDENCIES = ENABLE_SDGS
? [
  'user_roles',
  'categories',
  'users',
  'taxonomies',
  'recommendations',
  'recommendation_measures',
  'recommendation_categories',
  'measures',
  'measure_indicators',
  'measure_categories',
  'sdgtargets',
  'sdgtarget_indicators',
  'sdgtarget_categories',
  'indicators',
]
: [
  'user_roles',
  'categories',
  'users',
  'taxonomies',
  'recommendations',
  'recommendation_measures',
  'recommendation_categories',
  'measures',
  'measure_indicators',
  'measure_categories',
  'indicators',
];
