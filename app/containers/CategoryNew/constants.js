/*
 *
 * CategoryNew constants
 *
 */

import { fromJS } from 'immutable';

import { ENABLE_SDGS } from 'themes/config';

export const SAVE = 'impactoss/CategoryNew/SAVE';

export const DEPENDENCIES = ENABLE_SDGS
? [
  'measures',
  'sdgtargets',
  'recommendations',
  'users',
  'user_roles',
  'categories',
  'taxonomies',
  'measure_categories',
  'sdgtarget_categories',
  'recommendation_categories',
]
: [
  'measures',
  'recommendations',
  'users',
  'user_roles',
  'categories',
  'taxonomies',
  'measure_categories',
  'recommendation_categories',
];

export const FORM_INITIAL = fromJS({
  attributes: {
    title: '',
    description: '',
    short_title: '',
    url: '',
    manager_id: '',
    taxonomy_id: '',
    reference: '',
    user_only: false,
    draft: true,
  },
  associatedSdgTargets: [],
  associatedMeasures: [],
  associatedRecommendations: [],
  associatedUser: [],
});
