import { ENABLE_SDGS, ENABLE_INDICATORS } from 'themes/config';

let tables = [];
const baseTables = [
  'user_roles',
  'users',
  'taxonomies',
  'categories',
  'measures',
  'measure_categories',
  'recommendations',
  'recommendation_measures',
  'recommendation_categories',
];
const sdgTables = [
  'sdgtargets',
  'sdgtarget_categories',
  'sdgtarget_indicators',
  'sdgtarget_measures',
];
const indicatorTables = [
  'indicators',
  'measure_indicators',
];
tables = baseTables;
if (ENABLE_SDGS) {
  tables = tables.concat(sdgTables);
}
if (ENABLE_INDICATORS) {
  tables = tables.concat(indicatorTables);
}
export const DEPENDENCIES = tables;
