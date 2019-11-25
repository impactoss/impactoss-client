/*
 *
 * CategoryEdit constants
 *
 */
import { fromJS } from 'immutable';
import { ENABLE_SDGS, ENABLE_INDICATORS } from 'themes/config';

export const SAVE = 'impactoss/CategoryEdit/SAVE';

let tables = [];
const baseTables = [
  'measures',
  'recommendations',
  'users',
  'user_roles',
  'categories',
  'taxonomies',
  'measure_categories',
  'recommendation_categories',
];
const sdgTables = [
  'sdgtargets',
  'sdgtarget_categories',
];
const indicatorTables = [];
tables = baseTables;
if (ENABLE_SDGS) {
  tables = tables.concat(sdgTables);
}
if (ENABLE_INDICATORS) {
  tables = tables.concat(indicatorTables);
}
export const DEPENDENCIES = tables;

export const FORM_INITIAL = fromJS({
  id: '',
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
