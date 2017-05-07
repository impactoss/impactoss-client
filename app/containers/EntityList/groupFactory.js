import { forEach, map, orderBy } from 'lodash/collection';
import { lowerCase as loCase } from 'lodash/string';
import { lowerCase } from 'utils/string';
import { getConnectedCategoryIds } from 'utils/entities';
import isNumber from 'utils/is-number';

import { UNGROUP } from './constants';

export const makeGroupOptions = (filters, taxonomies, connectedTaxonomies, group, messageUngroup) => {
  let options = [
    {
      value: UNGROUP,
      label: messageUngroup,
      default: true,
      disabled: group === UNGROUP,
    },
  ];

  // taxonomy options
  if (filters.taxonomies && taxonomies) {
    // first prepare taxonomy options
    options = options.concat(Object.values(taxonomies).map((taxonomy) => ({
      value: taxonomy.id, // filterOptionId
      label: taxonomy.attributes.title,
      disabled: group === taxonomy.id,
    })));
  }
  // connectedTaxonomies options
  if (filters.connectedTaxonomies && connectedTaxonomies.taxonomies) {
    // first prepare taxonomy options
    options = options.concat(Object.values(connectedTaxonomies.taxonomies).map((taxonomy) => ({
      value: `x:${taxonomy.id}`, // filterOptionId
      label: taxonomy.attributes.title,
      disabled: group === `x:${taxonomy.id}`,
    })));
  }
  return options;
};

export const makeEntityGroups = (entitiesSorted, taxonomies, connectedTaxonomies, filters, locationQueryGroup) => {
  let groups = [{ entities: entitiesSorted }];
  if (locationQueryGroup) {
    if (isNumber(locationQueryGroup)) {
      const taxonomy = taxonomies[parseInt(locationQueryGroup, 10)];
      groups = makeTaxonomyGroups(entitiesSorted, taxonomy);
    } else {
      const locationQueryGroupSplit = locationQueryGroup.split(':');
      if (locationQueryGroupSplit.length > 1) {
        const taxonomy = connectedTaxonomies.taxonomies[parseInt(locationQueryGroupSplit[1], 10)];
        if (taxonomy) {
          groups = makeConnectedTaxonomyGroups(entitiesSorted, taxonomy, filters);
        }
      }
    }
  }
  return groups;
};

export const makeTaxonomyGroups = (entities, taxonomy) => {
  const groups = {};

  forEach(Object.values(entities), (entity) => {
    const taxCategoryIds = [];
    // if entity has taxonomies
    if (entity.taxonomies) {
      // add categories from entities if not present otherwise increase count
      const categoryIds = map(map(Object.values(entity.taxonomies), 'attributes'), 'category_id');
      forEach(taxonomy.categories, (cat, catId) => {
        // if entity has category of active taxonomy
        if (categoryIds && categoryIds.indexOf(parseInt(catId, 10)) > -1) {
          taxCategoryIds.push(catId);
          // if category already added
          if (groups[catId]) {
            groups[catId].entities.push(entity);
          } else {
            const label = cat.attributes.title || cat.attributes.name;
            groups[catId] = {
              label,
              entities: [entity],
              order: loCase(label),
            };
          }
        }
      });
    }
    if (taxCategoryIds.length === 0) {
      if (groups.without) {
        groups.without.entities.push(entity);
      } else {
        groups.without = {
          label: `Without ${lowerCase(taxonomy.attributes.title)}`, // `${messages.without} ${lowerCase(taxonomy.attributes.title)}`,
          entities: [entity],
          order: 'zzzzzzzz',
        };
      }
    }
  });  // for each entities
  return orderBy(Object.values(groups), 'order');
};

export const makeConnectedTaxonomyGroups = (entities, taxonomy, filters) => {
  const groups = {};

  forEach(Object.values(entities), (entity) => {
    const taxCategoryIds = [];
    forEach(filters.connectedTaxonomies.connections, (connection) => {
      // if entity has taxonomies
      if (entity[connection.path]) { // action.recommendations stores recommendation_measures
        // add categories from entities if not present otherwise increase count
        const categoryIds = getConnectedCategoryIds(
          entity,
          connection,
          taxonomy
        );
        forEach(taxonomy.categories, (cat, catId) => {
          // if entity has category of active taxonomy
          if (categoryIds && categoryIds.indexOf(parseInt(catId, 10)) > -1) {
            taxCategoryIds.push(catId);
            // if category already added
            if (groups[catId]) {
              groups[catId].entities.push(entity);
            } else {
              const label = cat.attributes.title || cat.attributes.name;
              groups[catId] = {
                label,
                entities: [entity],
                order: loCase(label),
              };
            }
          }
        });
      }
      if (taxCategoryIds.length === 0) {
        if (groups.without) {
          groups.without.entities.push(entity);
        } else {
          groups.without = {
            label: `Without ${lowerCase(taxonomy.attributes.title)}`, // `${messages.without} ${lowerCase(taxonomy.attributes.title)}`,
            entities: [entity],
            order: 'zzzzzzzzz',
          };
        }
      }
    });  // for each connection
  });  // for each entities
  return orderBy(Object.values(groups), 'order');
};
