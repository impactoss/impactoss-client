/*
 *
 * SdgTargetNew constants
 *
 */

import { fromJS } from 'immutable';

export const SAVE = 'nmrf/ActionNew/SAVE';

export const FORM_INITIAL = fromJS({
  attributes: {
    title: '',
    description: '',
    draft: true,
    reference: '',
  },
  associatedTaxonomies: {},
  associatedIndicators: [],
  associatedMeasures: [],
});
export const DEPENDENCIES = [
  'user_roles',
  'categories',
  'taxonomies',
  'indicators',
  'measures',
  'measure_categories',
];
