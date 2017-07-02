import { reduce } from 'lodash/collection';

import { cleanupSearchTarget } from 'utils/string';
import asList from 'utils/as-list';
import asArray from 'utils/as-array';
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
  .map((taxCategory) => categories.get(taxCategory.getIn(['attributes', 'category_id']).toString()).getIn(['attributes', 'taxonomy_id']))
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

// filter entities by by association with one or more entities of specific connection type
// assumes prior nesting of relationships
export const filterEntitiesByConnection = (entities, query, connections) =>
  entities.filter((entity) =>
    asArray(connections).reduce((passing, connection) =>
      passing && (query.get(connection.path)
        ? asList(query.get(connection.path)).reduce((passingQuery, associatedId) =>
          passingQuery && testEntityEntityAssociation(entity, connection, parseInt(associatedId, 10))
        , true)
        : true
      )
    , true)
  );
