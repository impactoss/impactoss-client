/*
 *
 * ActionEdit constants
 *
 */
import { ENABLE_SDGS } from 'themes/config';
export const SAVE = 'impactoss/ActionEdit/SAVE';

export const DEPENDENCIES = ENABLE_SDGS
? [
  'user_roles',
  'measures',
  'users',
  'categories',
  'taxonomies',
  'recommendations',
  'recommendation_measures',
  'measure_categories',
  'indicators',
  'measure_indicators',
  'sdgtargets',
  'sdgtarget_measures',
  'recommendation_categories',
  'sdgtarget_categories',
]
: [
  'user_roles',
  'measures',
  'users',
  'categories',
  'taxonomies',
  'recommendations',
  'recommendation_measures',
  'measure_categories',
  'indicators',
  'measure_indicators',
  'recommendation_categories',
];
