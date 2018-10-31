/*
 *
 * ActionNew constants
 *
 */
import { ENABLE_SDGS } from 'themes/config';

export const SAVE = 'impactoss/ActionNew/SAVE';

export const DEPENDENCIES = ENABLE_SDGS
? [
  'user_roles',
  'categories',
  'taxonomies',
  'recommendations',
  'indicators',
  'sdgtargets',
  'recommendation_categories',
  'sdgtarget_categories',
]
: [
  'user_roles',
  'categories',
  'taxonomies',
  'recommendations',
  'indicators',
  'recommendation_categories',
];
