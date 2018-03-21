import { ENABLE_SDGS } from 'themes/config';

export const DEPENDENCIES = ENABLE_SDGS
? [
  'taxonomies',
  'recommendations',
  'measures',
  'sdgtargets',
  'indicators',
]
: [
  'taxonomies',
  'recommendations',
  'measures',
  'indicators',
];
