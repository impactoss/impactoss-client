import {
  testEntityCategoryAssociation,
  getEntityTitle,
  getEntityReference,
  getEntityParentId,
  getCategoryShortTitle,
} from 'utils/entities';
import { truncateText } from 'utils/string';
import { sortEntities } from 'utils/sort';
import { TEXT_TRUNCATE } from 'themes/config';

import {
  optionChecked,
} from './utils';

export const makeCategoriesForTaxonomy = (
  taxonomy,
  config,
  entities,
  taxonomies,
  locationQuery,
) => {
  const categories = {
    items: [],
    groups: null,
  };
  // get the active taxonomy
  if (taxonomy && taxonomy.get('categories')) {
    const parentId = getEntityParentId(taxonomy);
    const parent = parentId && taxonomies.get(parentId);
    if (parent) {
      categories.groups = parent.get(
        'categories'
      ).map(
        (cat) => getEntityTitle(cat),
      ).toJS();
    }
    sortEntities(
      taxonomy.get('categories'),
      'asc',
      'referenceThenShortTitle',
      null,
      false,
    ).forEach(
      (category, catId) => {
        // add categories from entities if present
        const present = entities.some(
          (entity) => entity.get('categories')
            && testEntityCategoryAssociation(entity, catId)
        );
        if (present) {
          categories.items.push({
            id: catId,
            reference: getEntityReference(category, false),
            short: truncateText(
              getCategoryShortTitle(category),
              TEXT_TRUNCATE.ENTITY_TAG,
            ),
            label: getEntityTitle(category),
            group: parent && getEntityParentId(category),
            checked: optionChecked(locationQuery.get(config.query), catId),
          });
        }
      }
    );
  }
  return categories;
};
