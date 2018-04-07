import { Map, List, fromJS } from 'immutable';

import { TEXT_TRUNCATE } from 'themes/config';
import { find, reduce } from 'lodash/collection';

import { cleanupSearchTarget, regExMultipleWords, truncateText } from 'utils/string';
import asList from 'utils/as-list';
import isNumber from 'utils/is-number';
import appMessage from 'utils/app-message';

// check if entity has nested connection by id
export const testEntityEntityAssociation = (entity, path, associatedId) =>
  entity.get(path) && entity.get(path).includes(parseInt(associatedId, 10));

// check if entity has nested category by id
export const testEntityCategoryAssociation = (entity, categoryId) =>
  testEntityEntityAssociation(entity, 'categories', categoryId);

// check if entity has any category by taxonomy id
export const testEntityTaxonomyAssociation = (entity, categories, taxonomyId) =>
  entity
  .get('categories')
  .map((catId) => categories.size > 0 &&
    categories
    .get(catId.toString())
    .getIn(['attributes', 'taxonomy_id']))
  .includes(taxonomyId);

// check if entity has any nested connection by type
export const testEntityAssociation = (entity, associatedPath) =>
  entity.get(associatedPath) && entity.get(associatedPath).size > 0;

// prep searchtarget, incl id
export const prepareEntitySearchTarget = (entity, fields, queryLength) =>
  reduce(
    fields,
    (target, field) => queryLength > 1 || field === 'reference '
      ? `${target} ${cleanupSearchTarget(entity.getIn(['attributes', field]))}`
      : target
    , entity.get('id')
  );
// comparison of attribute values, force string, check 'null' if unspecified
export const attributesEqual = (testValue, value) =>
  typeof value !== 'undefined' && value !== null && value.toString() === ((typeof testValue === 'undefined' || testValue === null)
    ? 'null'
    : testValue.toString());

export const getConnectedCategories = (entityConnectedIds, taxonomyCategories, path) =>
  taxonomyCategories.filter((category) =>
    entityConnectedIds.reduce((passing, connectionId) =>
      passing || testEntityEntityAssociation(category, path, connectionId)
    , false)
  );


// filter entities by absence of association either by taxonomy id or connection type
// assumes prior nesting of relationships
export const filterEntitiesWithoutAssociation = (entities, categories, query) =>
  entities && entities.filter((entity) =>
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
  entities && entities.filter((entity) =>
    asList(query).reduce((passing, categoryId) =>
      passing && testEntityCategoryAssociation(entity, parseInt(categoryId, 10))
    , true)
  );

// filter entities by association with one or more categories
// assumes prior nesting of relationships
export const filterEntitiesByConnectedCategories = (entities, connections, query) =>
  entities && entities.filter((entity) =>
    asList(query).reduce((passing, queryArg) => {
      const pathValue = queryArg.split(':');
      const path = pathValue[0];
      const connectionsForPath = connections.get(path);
      return connectionsForPath
        ? passing && connectionsForPath.reduce((passingConnection, connection) =>
          // test
          // if any connection is associated with entity AND if connection is associated to category
          passingConnection || (
            testEntityEntityAssociation(entity, path, connection.get('id'))
            && testEntityCategoryAssociation(connection, pathValue[1])
          )
        , false)
        : passing;
    }
    , true)
  );

// filter entities by by association with one or more entities of specific connection type
// assumes prior nesting of relationships
export const filterEntitiesByConnection = (entities, query) =>
  entities && entities.filter((entity) =>
    asList(query).reduce((passing, queryArg) => {
      const pathValue = queryArg.split(':');
      const path = pathValue[0];
      return entity.get(path)
        ? passing && testEntityEntityAssociation(entity, path, pathValue[1])
        : passing;
    }, true)
  );

// query is object not string!
export const filterEntitiesByAttributes = (entities, query) =>
  entities && entities.filter((entity) =>
    reduce(query, (passing, value, attribute) =>
      // TODO if !passing return false, no point going further
      passing && ((attribute === 'id')
      ? attributesEqual(entity.get('id'), value)
      : attributesEqual(entity.getIn(['attributes', attribute]), value))
    , true)
  );

export const filterEntitiesByKeywords = (entities, query, searchAttributes) => {
  try {
    const regex = new RegExp(regExMultipleWords(query), 'i');
    return entities && entities.filter((entity) =>
      regex.test(prepareEntitySearchTarget(entity, searchAttributes, query.length))
    );
  } catch (e) {
    return entities;
  }
};

export const entitiesSetCategoryIds = (entities, entityKey, entityCategories) =>
  entities && entities.map((entity) => entitySetCategoryIds(entity, entityKey, entityCategories));

export const entitySetCategoryIds = (entity, entityKey, entityCategories) =>
  entity.set(
    'categories',
    entityCategories
    .filter((association) => attributesEqual(association.getIn(['attributes', entityKey]), entity.get('id')))
    .map((association) => association.getIn(['attributes', 'category_id']))
  );

export const entitiesSetAssociated = (entities, entityKey, associations, associationKey, associationId) =>
  entities && entities.map((entity) =>
    entitySetAssociated(entity, entityKey, associations, associationKey, associationId));

export const entitySetAssociated = (entity, entityKey, associations, associationKey, associationId) => {
  const entityAssociation = associations.find((association) =>
    attributesEqual(association.getIn(['attributes', entityKey]), entity.get('id'))
    && attributesEqual(association.getIn(['attributes', associationKey]), associationId)
  );
  return entity.set('associated', entityAssociation || false);
};

export const entitiesIsAssociated = (entities, entityKey, associations, associationKey, associationId) =>
  entities && associations && entities.filter((entity) =>
    associations.find((association) =>
      attributesEqual(association.getIn(['attributes', entityKey]), entity.get('id'))
      && attributesEqual(association.getIn(['attributes', associationKey]), associationId)
    )
  );
export const entitiesSetSingle = (entities, related, key, relatedKey) =>
  entities && entities.map((entity) =>
    entitySetSingle(entity, related, key, relatedKey));

export const entitySetSingle = (entity, related, key, relatedKey) =>
  entity && entity.set(key,
    related.find((r) => attributesEqual(entity.getIn(['attributes', relatedKey]), r.get('id')))
  );

export const entitySetUser = (entity, users) =>
  entity && entitySetSingle(entity, users, 'user', 'last_modified_user_id');

export const entitySetSingles = (entity, singles) =>
  entity && singles.reduce((memo, { related, key, relatedKey }) =>
   entitySetSingle(memo, related, key, relatedKey), entity);


export const prepareTaxonomiesIsAssociated = (taxonomies, categories, associations, tagsKey, associationKey, associationId) =>
  taxonomies && taxonomies
  .filter((tax) => tax.getIn(['attributes', tagsKey]))
  .map((tax) =>
    tax.set('categories', categories
      .filter((cat) =>
        attributesEqual(cat.getIn(['attributes', 'taxonomy_id']), tax.get('id'))
        && associations.find((association) =>
          attributesEqual(association.getIn(['attributes', 'category_id']), cat.get('id'))
          && attributesEqual(association.getIn(['attributes', associationKey]), associationId)
        )
      )
    )
  );

export const prepareTaxonomiesAssociated = (taxonomies, categories, associations, tagsKey, associationKey, associationId) =>
  taxonomies && taxonomies
  .filter((tax) => tax.getIn(['attributes', tagsKey]))
  .map((tax) => tax.set('categories', entitiesSetAssociated(
    categories.filter((cat) =>
      attributesEqual(cat.getIn(['attributes', 'taxonomy_id']), tax.get('id'))
      && (!cat.getIn(['attributes', 'user_only']) || tagsKey === 'tags_users')
    ),
    'category_id',
    associations,
    associationKey,
    associationId
  )));

export const prepareTaxonomiesMultiple = (taxonomies, categories, tagsKeys) =>
  // TODO deal with conflicts
  reduce(tagsKeys, (memo, tagsKey) => memo.merge(prepareTaxonomies(taxonomies, categories, tagsKey)), Map());

export const prepareTaxonomies = (taxonomies, categories, tagsKey) =>
  taxonomies && taxonomies
  .filter((tax) => tax.getIn(['attributes', tagsKey]))
  .map((tax) => tax.set('categories',
    categories.filter((cat) =>
      attributesEqual(cat.getIn(['attributes', 'taxonomy_id']), tax.get('id'))
      && (!cat.getIn(['attributes', 'user_only']) || tagsKey === 'tags_users')
    )
  ));

export const prepareCategory = (category, users, taxonomies) =>
  category && entitySetUser(
    category.set('taxonomy', taxonomies.find((tax) => attributesEqual(category.getIn(['attributes', 'taxonomy_id']), tax.get('id')))),
    users
  );

export const usersByRole = (users, userRoles, roleId) =>
  users && users
  .filter((user) => {
    const roles = userRoles.filter((association) =>
      attributesEqual(association.getIn(['attributes', 'role_id']), roleId)
      && attributesEqual(association.getIn(['attributes', 'user_id']), user.get('id'))
    );
    return roles && roles.size > 0;
  });

export const getEntityTitle = (entity, labels, contextIntl) => {
  if (labels && contextIntl) {
    const label = find(labels, { value: parseInt(entity.get('id'), 10) });
    if (label && label.message) {
      return appMessage(contextIntl, label.message);
    }
  }
  return entity.getIn(['attributes', 'title']) || entity.getIn(['attributes', 'name']);
};

export const getEntityReference = (entity, defaultToId = true) =>
  defaultToId
    ? (entity.getIn(['attributes', 'reference'])
      || entity.getIn(['attributes', 'number'])
      || entity.get('id'))
    : (entity.getIn(['attributes', 'reference']) || null);

export const getCategoryShortTitle = (category) =>
  truncateText(
    category.getIn(['attributes', 'short_title']) && category.getIn(['attributes', 'short_title']).trim().length > 0
      ? category.getIn(['attributes', 'short_title'])
      : category.getIn(['attributes', 'title']) || category.getIn(['attributes', 'name']),
    TEXT_TRUNCATE.ENTITY_TAG
  );


const getInitialValue = (field) =>
  typeof field.default !== 'undefined' ? field.default : '';

export const getInitialFormData = (shape) => {
  let fields = fromJS({
    id: '',
    attributes: {},
  });
  if (shape.fields) {
    fields = reduce(shape.fields, (memo, field) =>
      field.disabled ? memo : memo.setIn(['attributes', field.attribute], getInitialValue(field))
    , fields);
  }
  if (shape.taxonomies) {
    fields = fields.set('associatedTaxonomies', Map());
  }
  if (shape.connections) {
    fields = reduce(shape.connections.tables, (memo, table) => {
      if (table.table === 'recommendations') {
        return fields.set('associatedRecommendations', List());
      }
      if (table.table === 'indicators') {
        return fields.set('associatedIndicators', List());
      }
      if (table.table === 'measures') {
        return fields.set('associatedMeasures', List());
      }
      if (table.table === 'sdgtargets') {
        return fields.set('associatedSdgTargets', List());
      }
      return memo;
    }, fields);
  }
  return fields;
};
