import { Map, List } from 'immutable';
import { forEach } from 'lodash/collection';
import { lowerCase as loCase } from 'lodash/string';
import { lowerCase } from 'utils/string';
import { getConnectedCategoryIdsImmutable } from 'utils/entities';
import isNumber from 'utils/is-number';

export const groupEntities = (
  entities,
  taxonomies,
  connectedTaxonomies,
  filters,
  locationQuery
) => locationQuery.get('subgroup')
  ? makeEntityGroups(entities, taxonomies, connectedTaxonomies, filters, locationQuery.get('group'))
    .map((group) => group.set(
      'entityGroups',
      makeEntityGroups(group.get('entities'), taxonomies, connectedTaxonomies, filters, locationQuery.get('subgroup'))
    ))
  : makeEntityGroups(entities, taxonomies, connectedTaxonomies, filters, locationQuery.get('group'));

const makeEntityGroups = (
  entities,
  taxonomies,
  connectedTaxonomies,
  filters,
  locationQueryGroup
) => {
  if (locationQueryGroup) {
    if (isNumber(locationQueryGroup)) {
      const taxonomy = taxonomies.get(locationQueryGroup);
      return makeTaxonomyGroups(entities, taxonomy);
    }
    const locationQueryGroupSplit = locationQueryGroup.split(':');
    if (locationQueryGroupSplit.length > 1) {
      const taxonomy = connectedTaxonomies.get(locationQueryGroupSplit[1]);
      if (taxonomy) {
        return makeConnectedTaxonomyGroups(entities, taxonomy, filters);
      }
    }
    return List().push(Map({ entities }));
  }
  return List().push(Map({ entities }));
};

export const makeTaxonomyGroups = (entities, taxonomy) => {
  let groups = Map();
  entities.forEach((entity) => {
    let taxCategoryIds = List();
    // if entity has taxonomies
    if (entity.get('categories')) {
      // add categories from entities if not present otherwise increase count
      const categoryIds = entity
        .get('categories')
        .map((cat) => cat.get('attributes'))
        .map((att) => att.get('category_id'));
      taxonomy.get('categories').forEach((cat, catId) => {
        // if entity has category of active taxonomy
        if (categoryIds && categoryIds.includes(parseInt(catId, 10))) {
          taxCategoryIds = taxCategoryIds.push(catId);
          // if category already added
          if (groups.get(catId)) {
            groups = groups.setIn([catId, 'entities'], groups.getIn([catId, 'entities']).push(entity));
          } else {
            const label = cat.getIn(['attributes', 'title']) || cat.getIn(['attributes', 'name']);
            groups = groups.set(catId, Map({
              label,
              entities: List().push(entity),
              order: loCase(label),
              id: catId,
            }));
          }
        }
      });
    }
    if (taxCategoryIds.size === 0) {
      if (groups.get('without')) {
        groups = groups.setIn(['without', 'entities'], groups.getIn(['without', 'entities']).push(entity));
      } else {
        groups = groups.set('without', Map({
          label: `Without ${lowerCase(taxonomy.getIn(['attributes', 'title']))}`, // `${messages.without} ${lowerCase(taxonomy.attributes.title)}`,
          entities: List().push(entity),
          order: 'zzzzzzzz',
          id: 'without',
        }));
      }
    }
  });  // for each entities
  return groups.sortBy((group) => group.get('order')).toList();
};

export const makeConnectedTaxonomyGroups = (entities, taxonomy, filters) => {
  let groups = Map();
  entities.forEach((entity) => {
    let taxCategoryIds = List();
    forEach(filters.connectedTaxonomies.connections, (connection) => {
      // if entity has taxonomies
      if (entity.get(connection.path)) { // measure.recommendations stores recommendation_measures
        // add categories from entities if not present otherwise increase count
        const categoryIds = getConnectedCategoryIdsImmutable(
          entity,
          connection,
          taxonomy
        );
        taxonomy.get('categories').forEach((cat, catId) => {
          // if entity has category of active taxonomy
          if (categoryIds && categoryIds.includes(parseInt(catId, 10))) {
            taxCategoryIds = taxCategoryIds.push(catId);
            // if category already added
            if (groups.get(catId)) {
              groups = groups.setIn([catId, 'entities'], groups.getIn([catId, 'entities']).push(entity));
            } else {
              const label = cat.getIn(['attributes', 'title']) || cat.getIn(['attributes', 'name']);
              groups = groups.set(catId, Map({
                label,
                entities: List().push(entity),
                order: loCase(label),
                id: catId,
              }));
            }
          }
        });
      }
      if (taxCategoryIds.size === 0) {
        if (groups.get('without')) {
          groups = groups.setIn(['without', 'entities'], groups.getIn(['without', 'entities']).push(entity));
        } else {
          groups = groups.set('without', Map({
            label: `Without ${lowerCase(taxonomy.getIn(['attributes', 'title']))}`, // `${messages.without} ${lowerCase(taxonomy.attributes.title)}`,
            entities: List().push(entity),
            order: 'zzzzzzzzz',
            id: 'without',
          }));
        }
      }
    });  // for each connection
  });  // for each entities
  return groups.sortBy((group) => group.get('order')).toList();
};
//
// export const getGroupedEntitiesForPage = (pageItems, entitiesGrouped) =>
//   pageItems.reduce((groups, item) => {
//     // figure out 1st level group and existing targetGroup
//     const group = entitiesGrouped[item.group];
//     const targetGroup = find(groups, { id: group.id });
//     const entity = item.entity;
//     // if subgroup
//     if (group.entitiesGrouped) {
//       const subgroup = group.entitiesGrouped[item.subgroup];
//       // create 1st level targetGroup if not exists
//       if (!targetGroup) {
//         // also create 2nd level targetGroup if required
//         groups.push({
//           entitiesGrouped: [{
//             entities: [entity],
//             label: subgroup.label,
//             order: subgroup.order,
//             id: subgroup.id,
//           }],
//           label: group.label,
//           order: group.order,
//           id: group.id,
//         });
//       } else {
//         // 1st level targetGroup already exists
//         const targetSubgroup = find(targetGroup.entitiesGrouped, { id: subgroup.id });
//         // create 2nd level targetGroup if not exists
//         if (!targetSubgroup) {
//           // create subgroup
//           targetGroup.entitiesGrouped.push({
//             entities: [entity],
//             label: subgroup.label,
//             order: subgroup.order,
//             id: subgroup.id,
//           });
//         } else {
//           // add to existing subgroup
//           targetSubgroup.entities.push(entity);
//         }
//       }
//     // no subgroups
//     } else if (!targetGroup) {
//       // create without 2nd level targetGroup
//       groups.push({
//         entities: [entity],
//         label: group.label,
//         order: group.order,
//         id: group.id,
//       });
//     } else {
//       // add to group
//       targetGroup.entities.push(entity);
//     }
//     return groups;
//   }, []);
