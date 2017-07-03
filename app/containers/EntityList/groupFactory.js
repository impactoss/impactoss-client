import { forEach, map, orderBy, find } from 'lodash/collection';
import { lowerCase as loCase } from 'lodash/string';
import { lowerCase } from 'utils/string';
import { getConnectedCategoryIds } from 'utils/entities';
import isNumber from 'utils/is-number';


export const makeGroupOptions = (taxonomies, connectedTaxonomies) => {
  let options = [];

  // taxonomy options
  if (taxonomies) {
    // first prepare taxonomy options
    options = options.concat(Object.values(taxonomies).map((taxonomy) => ({
      value: taxonomy.id, // filterOptionId
      label: taxonomy.attributes.title,
    })));
  }
  // connectedTaxonomies options
  if (connectedTaxonomies) {
    // first prepare taxonomy options
    options = options.concat(Object.values(connectedTaxonomies).map((taxonomy) => ({
      value: `x:${taxonomy.id}`, // filterOptionId
      label: taxonomy.attributes.title,
    })));
  }
  return options;
};

export const groupEntities = (entitiesSorted, taxonomies, connectedTaxonomies, filters, groups) =>
  map(makeEntityGroups(entitiesSorted, taxonomies, connectedTaxonomies, filters, groups.group), (entityGroup) => groups.subgroup
    ? Object.assign(entityGroup, {
      entitiesGrouped: makeEntityGroups(entityGroup.entities, taxonomies, connectedTaxonomies, filters, groups.subgroup),
    })
    : entityGroup
  );

export const makeEntityGroups = (entitiesSorted, taxonomies, connectedTaxonomies, filters, locationQueryGroup) => {
  if (locationQueryGroup) {
    if (isNumber(locationQueryGroup)) {
      const taxonomy = taxonomies[parseInt(locationQueryGroup, 10)];
      return makeTaxonomyGroups(entitiesSorted, taxonomy);
    }
    const locationQueryGroupSplit = locationQueryGroup.split(':');
    if (locationQueryGroupSplit.length > 1) {
      const taxonomy = connectedTaxonomies[parseInt(locationQueryGroupSplit[1], 10)];
      if (taxonomy) {
        return makeConnectedTaxonomyGroups(entitiesSorted, taxonomy, filters);
      }
    }
    return [{ entities: entitiesSorted }];
  }
  return [{ entities: entitiesSorted }];
};

export const makeTaxonomyGroups = (entities, taxonomy) => {
  const groups = {};
  forEach(Object.values(entities), (entity) => {
    const taxCategoryIds = [];
    // if entity has taxonomies
    if (entity.categories) {
      // add categories from entities if not present otherwise increase count
      const categoryIds = map(map(Object.values(entity.categories), 'attributes'), 'category_id');
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
              id: catId,
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
          id: 'without',
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
      if (entity[connection.path]) { // measure.recommendations stores recommendation_measures
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
                id: catId,
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
            id: 'without',
          };
        }
      }
    });  // for each connection
  });  // for each entities
  return orderBy(Object.values(groups), 'order');
};

export const getGroupedEntitiesForPage = (pageItems, entitiesGrouped) =>
  pageItems.reduce((groups, item) => {
    // figure out 1st level group and existing targetGroup
    const group = entitiesGrouped[item.group];
    const targetGroup = find(groups, { id: group.id });
    const entity = item.entity;
    // if subgroup
    if (group.entitiesGrouped) {
      const subgroup = group.entitiesGrouped[item.subgroup];
      // create 1st level targetGroup if not exists
      if (!targetGroup) {
        // also create 2nd level targetGroup if required
        groups.push({
          entitiesGrouped: [{
            entities: [entity],
            label: subgroup.label,
            order: subgroup.order,
            id: subgroup.id,
          }],
          label: group.label,
          order: group.order,
          id: group.id,
        });
      } else {
        // 1st level targetGroup already exists
        const targetSubgroup = find(targetGroup.entitiesGrouped, { id: subgroup.id });
        // create 2nd level targetGroup if not exists
        if (!targetSubgroup) {
          // create subgroup
          targetGroup.entitiesGrouped.push({
            entities: [entity],
            label: subgroup.label,
            order: subgroup.order,
            id: subgroup.id,
          });
        } else {
          // add to existing subgroup
          targetSubgroup.entities.push(entity);
        }
      }
    // no subgroups
    } else if (!targetGroup) {
      // create without 2nd level targetGroup
      groups.push({
        entities: [entity],
        label: group.label,
        order: group.order,
        id: group.id,
      });
    } else {
      // add to group
      targetGroup.entities.push(entity);
    }
    return groups;
  }, []);
