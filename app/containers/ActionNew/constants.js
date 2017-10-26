/*
 *
 * ActionNew constants
 *
 */

import { fromJS } from 'immutable';

export const SAVE = 'impactoss/ActionNew/SAVE';

export const FORM_INITIAL = fromJS({
  attributes: {
    title: '',
    description: '',
    draft: true,
    target_date: '',
    target_date_comment: '',
    outcome: '',
    indicator_summary: '',
  },
  associatedTaxonomies: {},
  associatedRecommendations: [],
  associatedIndicators: [],
  associatedSdgTargets: [],
});

export const DEPENDENCIES = [
  'user_roles',
  'categories',
  'taxonomies',
  'recommendations',
  'indicators',
  'sdgtargets',
  'recommendation_categories',
  'sdgtarget_categories',
];
