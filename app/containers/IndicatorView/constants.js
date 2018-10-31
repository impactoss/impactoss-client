/*
 *
 * IndicatorView constants
 *
 */

import { ENABLE_SDGS } from 'themes/config';

export const DEPENDENCIES = ENABLE_SDGS
? [
  'user_roles',
  'measures',
  'sdgtargets',
  'users',
  'indicators',
  'measure_indicators',
  'sdgtarget_indicators',
  'progress_reports',
  'due_dates',
  'taxonomies',
  'categories',
  'recommendations',
  'recommendation_measures',
  'measure_categories',
  'sdgtarget_categories',
  'user_roles',
]
: [
  'user_roles',
  'measures',
  'users',
  'indicators',
  'measure_indicators',
  'progress_reports',
  'due_dates',
  'taxonomies',
  'categories',
  'recommendations',
  'recommendation_measures',
  'measure_categories',
  'user_roles',
];
