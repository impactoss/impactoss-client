import { ENABLE_SDGS, ENABLE_INDICATORS } from 'themes/config';

let tables = [];
const baseTables = [
  'user_roles',
  'categories',
  'taxonomies',
  'recommendation_categories',
  'recommendations',
  'measure_categories',
  'recommendation_measures',
  'measures',
];
const sdgTables = [
  'sdgtarget_categories',
  'sdgtarget_measures',
  'sdgtargets',
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

export const TAXONOMY_DEFAULT = 1;

export const SORT_OPTIONS = [
  {
    query: 'title',
    field: 'referenceThenTitle',
    order: 'asc',
    type: 'string',
    default: 'true',
  },
  {
    query: 'measures',
    field: 'measures',
    type: 'number',
    order: 'desc',
  },
  {
    query: 'recommendations',
    field: 'recommendations',
    type: 'number',
    order: 'desc',
  },
  {
    query: 'sdgtargets',
    field: 'sdgtargets',
    type: 'number',
    order: 'desc',
  },
];

export const SORT_CHANGE = 'impactoss/CategoryList/SORT_CHANGE';
