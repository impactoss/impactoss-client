import { reduce, find } from 'lodash/collection';

import { cleanupSearchTarget } from 'utils/string';
import asList from 'utils/as-list';
import isNumber from 'utils/is-number';

// check if entity has nested connection by id
const testEntityEntityAssociation = (entity, connection, associatedId) =>
  entity
  .get(connection.path)
  .map((associatedEntity) => associatedEntity.getIn(['attributes', connection.key]))
  .includes(associatedId);

// check if entity has nested category by id
const testEntityCategoryAssociation = (entity, categoryId) =>
  entity
  .get('categories')
  .map((taxCategory) => taxCategory.getIn(['attributes', 'category_id']))
  .includes(categoryId);

// check if entity has any category by taxonomy id
const testEntityTaxonomyAssociation = (entity, categories, taxonomyId) =>
  entity
  .get('categories')
  .map((taxCategory) => {
    const category = categories.get(taxCategory.getIn(['attributes', 'category_id']).toString());
    return category
    ? category.getIn(['attributes', 'taxonomy_id'])
    : category;
  })
  .includes(taxonomyId);
// check if entity has any nested connection by type
const testEntityAssociation = (entity, associatedPath) =>
  entity.get(associatedPath) && entity.get(associatedPath).size > 0;

// prep searchtarget, incl id
export const prepareEntitySearchTarget = (entity, fields) =>
  reduce(
    fields,
    (target, field) => `${target} ${cleanupSearchTarget(entity.getIn(['attributes', field]))}`,
    entity.get('id')
  );

// comparison of attribute values, force string, check 'null' if unspecified
export const attributesEqual = (testValue, value) =>
  value.toString() === ((typeof testValue === 'undefined' || testValue === null)
    ? 'null'
    : testValue.toString());


// filter entities by absence of association either by taxonomy id or connection type
// assumes prior nesting of relationships
export const filterEntitiesWithoutAssociation = (entities, categories, query) =>
  entities.filter((entity) =>
    asList(query).reduce((passing, pathOrTax) =>
      passing && !(isNumber(pathOrTax)
        ? testEntityTaxonomyAssociation(entity, categories, parseInt(pathOrTax, 10))
        : testEntityAssociation(entity, pathOrTax)
      )
    , true)
  );

// filter entities by association with one or more categories
// assumes prior nesting of relationships
export const filterEntitiesByCategories = (entities, query) =>
  entities.filter((entity) =>
    asList(query).reduce((passing, categoryId) =>
      passing && testEntityCategoryAssociation(entity, parseInt(categoryId, 10))
    , true)
  );

// filter entities by association with one or more categories
// assumes prior nesting of relationships
export const filterEntitiesByConnectedCategories = (entities, connections, query, connectionKeys) =>
  entities.filter((entity) =>
    asList(query).reduce((passing, queryArg) => {
      const pathValue = queryArg.split(':');
      const path = pathValue[0];
      const connectionsForPath = connections.get(path);
      return connectionsForPath
        ? passing && connectionsForPath.reduce((passingConnection, connection) =>
          // test
          // if any connection is associated with entity AND if connection is associated to category
          passingConnection || (
            testEntityEntityAssociation(entity, { path, key: connectionKeys[path] }, parseInt(connection.get('id'), 10))
            && testEntityCategoryAssociation(connection, parseInt(pathValue[1], 10))
          )
        , false)
        : passing;
    }
    , true)
  );

// filter entities by by association with one or more entities of specific connection type
// assumes prior nesting of relationships
export const filterEntitiesByConnection = (entities, query, connectionPathKeys) =>
  entities.filter((entity) =>
    asList(query).reduce((passing, queryArg) => {
      const pathValue = queryArg.split(':');
      const path = pathValue[0];
      const connectionPathKey = find(connectionPathKeys, (cpk) => cpk.path === path);
      return connectionPathKey
        ? passing && testEntityEntityAssociation(entity, connectionPathKey, parseInt(pathValue[1], 10))
        : passing;
    }, true)
  );

const getEntitySortValueMapper = (entity, sortBy) => {
  switch (sortBy) {
    case 'id':
      // ID field needs to be treated as an int when sorting
      return entity.get(sortBy);
    default:
      return entity.getIn(['attributes', sortBy]);
  }
};
const getEntitySortComparator = (valueA, valueB, sortOrder) => {
  // check equality
  if (valueA === valueB) {
    return 0;
  }
  let result;
  const floatA = parseFloat(valueA);
  const floatB = parseFloat(valueB);
  const aStartsWithNumber = !isNaN(floatA);
  const bStartsWithNumber = !isNaN(floatB);
  if (aStartsWithNumber && !bStartsWithNumber) {
    result = -1;
  } else if (!aStartsWithNumber && bStartsWithNumber) {
    result = 1;
  } else if (aStartsWithNumber && bStartsWithNumber) {
    const aIsNumber = aStartsWithNumber && isFinite(valueA);
    const bIsNumber = aStartsWithNumber && isFinite(valueA);
    if (aIsNumber && !bIsNumber) {
      result = -1;
    } else if (!aIsNumber && bIsNumber) {
      result = 1;
    } else if (aIsNumber && bIsNumber) {
      // both numbers
      result = floatA < floatB ? -1 : 1;
    } else if (floatA !== floatB) {
      // both starting with number but are not numbers entirely
      // compare numbers first then remaining strings if numbers equal
      result = floatA < floatB ? -1 : 1;
    } else {
      result = getEntitySortComparator(
        valueA.slice(floatA.toString().length - (valueA.slice(0, 1) === '.' ? 1 : 0)),
        valueB.slice(floatB.toString().length - (valueB.slice(0, 1) === '.' ? 1 : 0)),
        'asc'
      );
    }
  } else {
    // neither starting with number
    result = valueA < valueB ? -1 : 1;
  }
  return sortOrder === 'desc' ? result * -1 : result;
};
export const sortEntities = (entities, sortOrder, sortBy) =>
  entities
    .sortBy(
      (entity) => getEntitySortValueMapper(entity, sortBy || 'id'),
      (a, b) => getEntitySortComparator(a, b, sortOrder || 'asc')
    ).toList();
