import { ENABLE_SDGS, ENABLE_INDICATORS } from 'themes/config';

let tables = [];
const baseTables = [
  'user_roles',
  'recommendations',
  'users',
  'taxonomies',
  'categories',
  'measures',
  'recommendation_measures',
  'recommendation_categories',
  'measure_categories',
];
const sdgTables = [
  'sdgtargets',
  'sdgtarget_measures',
];
const indicatorTables = [
  'measure_indicators',
  'indicators',
];
tables = baseTables;
if (ENABLE_SDGS) {
  tables = tables.concat(sdgTables);
}
if (ENABLE_INDICATORS) {
  tables = tables.concat(indicatorTables);
}
export const DEPENDENCIES = tables;
