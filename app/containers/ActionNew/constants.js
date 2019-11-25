/*
 *
 * ActionNew constants
 *
 */
import { ENABLE_SDGS, ENABLE_INDICATORS } from 'themes/config';

export const SAVE = 'impactoss/ActionNew/SAVE';

let tables = [];
const baseTables = [
  'user_roles',
  'categories',
  'taxonomies',
  'recommendations',
  'recommendation_categories',
];
const sdgTables = [
  'sdgtargets',
  'sdgtarget_categories',
];
const indicatorTables = [
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
