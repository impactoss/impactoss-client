/*
 *
 * SdgTargetEdit constants
 *
 */
import { fromJS } from 'immutable';

export const SAVE = 'nmrf/SdgTargetEdit/SAVE';

export const FORM_INITIAL = fromJS({
  id: '',
  attributes: {
    title: '',
    description: '',
    draft: '',
    reference: '',
  },
  associatedTaxonomies: {},
  associatedIndicators: [],
  associatedMeasures: [],
});


export const DEPENDENCIES = [
  'user_roles',
  'sdgtargets',
  'users',
  'categories',
  'taxonomies',
  'sdgtarget_categories',
  'indicators',
  'sdgtarget_indicators',
  'measures',
  'sdgtarget_measures',
  'measure_categories',
];
