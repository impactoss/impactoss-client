import { Map } from 'immutable';

import { TEXT_TRUNCATE, ACCEPTED_STATUSES } from 'themes/config';
import { find, reduce } from 'lodash/collection';

import { cleanupSearchTarget, regExMultipleWords, truncateText } from 'utils/string';
import asList from 'utils/as-list';
import isNumber from 'utils/is-number';
import appMessage from 'utils/app-message';
import quasiEquals from 'utils/quasi-equals';

export const getAcceptanceStatus = (entity) => find(
  ACCEPTED_STATUSES,
  (option) => option.value === (entity.getIn(['attributes', 'accepted']) || null)
);

// check if entity has nested connection by id
export const testEntityEntityAssociation = (entity, path, associatedId) => entity.get(path) && entity.get(path).includes(parseInt(associatedId, 10));

// check if entity has nested category by id
export const testEntityCategoryAssociation = (entity, categoryId) => testEntityEntityAssociation(entity, 'categories', categoryId);
export const testEntityParentCategoryAssociation = (entity, categories, categoryId) => testEntityEntityAssociation(entity, 'categories', categoryId);

// check if entity has any category by taxonomy id
export const testEntityTaxonomyAssociation = (entity, categories, taxonomyId) => entity
  .get('categories')
  .map((catId) => categories.size > 0 && categories.get(catId.toString())
      && categories
        .get(catId.toString())
        .getIn(['attributes', 'taxonomy_id']))
  .includes(taxonomyId);

// check if entity has any nested connection by type
export const testEntityAssociation = (entity, associatedPath) => {
  // check for fw
  if (associatedPath.indexOf('_') > -1) {
    const path = associatedPath.split('_');
    if (entity.getIn([`${path[0]}ByFw`, path[1]])) {
      return entity.getIn([`${path[0]}ByFw`, path[1]]).size > 0;
    }
  }
  return entity.get(associatedPath) && entity.get(associatedPath).size > 0;
};

// prep searchtarget, incl id
export const prepareEntitySearchTarget = (entity, fields, queryLength) => reduce(
  fields,
  (target, field) => queryLength > 1 || field === 'reference '
    ? `${target} ${cleanupSearchTarget(entity.getIn(['attributes', field]))}`
    : target,
  entity.get('id')
);
// comparison of attribute values, force string, check 'null' if unspecified
export const attributesEqual = (testValue, value) => quasiEquals(testValue, value);

export const getConnectedCategories = (entityConnectedIds, taxonomyCategories, path) => taxonomyCategories.filter((category) => entityConnectedIds.some((connectionId) => testEntityEntityAssociation(category, path, connectionId)));


// filter entities by absence of association either by taxonomy id or connection type
// assumes prior nesting of relationships
export const filterEntitiesWithoutAssociation = (entities, categories, query) => entities && entities.filter((entity) => asList(query).reduce(
  (passing, pathOrTax) => passing
        && !(
          isNumber(pathOrTax)
            ? testEntityTaxonomyAssociation(entity, categories, parseInt(pathOrTax, 10))
            : testEntityAssociation(entity, pathOrTax)
        ),
  true,
),);

// filter entities by association with one or more categories
// assumes prior nesting of relationships
export const filterEntitiesByCategories = (entities, query) => entities && entities.filter((entity) => asList(query).reduce((passing, categoryId) => passing && testEntityCategoryAssociation(entity, parseInt(categoryId, 10)),
  true));

// filter entities by association with one or more categories
// assumes prior nesting of relationships
export const filterEntitiesByConnectedCategories = (entities, connections, query) => entities && entities.filter((entity) => asList(query).reduce((passing, queryArg) => {
  const pathValue = queryArg.split(':');
  const path = pathValue[0];
  const connectionsForPath = connections.get(path);
  return connectionsForPath
    ? passing && connectionsForPath.some((connection) => testEntityEntityAssociation(entity, path, connection.get('id'))
            && testEntityCategoryAssociation(connection, pathValue[1]))
    : passing;
}, true));

// filter entities by by association with one or more entities of specific connection type
// assumes prior nesting of relationships
export const filterEntitiesByConnection = (entities, query) => entities && entities.filter((entity) => asList(query).reduce((passing, queryArg) => {
  const pathValue = queryArg.split(':');
  const path = pathValue[0].split('_')[0];
  return entity.get(path)
    ? passing && testEntityEntityAssociation(entity, path, pathValue[1])
    : passing;
}, true));

// query is object not string!
// TODO if !passing return false, no point going further | some!
export const filterEntitiesByAttributes = (entities, query) => entities
  && entities.filter(
    (entity) => reduce(
      query,
      (passing, value, attribute) => passing
        && (
          (attribute === 'id')
            ? attributesEqual(entity.get('id'), value)
            : attributesEqual(entity.getIn(['attributes', attribute]), value)
        ),
      true,
    )
  );

export const filterEntitiesByKeywords = (entities, query, searchAttributes) => {
  try {
    const regex = new RegExp(regExMultipleWords(query), 'i');
    return entities && entities.filter((entity) => regex.test(prepareEntitySearchTarget(entity, searchAttributes, query.length)));
  } catch (e) {
    return entities;
  }
};

export const entitiesSetCategoryIds = (entities, entityKey, associations, categories, includeParents = true) => entities && entities.map((entity) => entity.set('categories', getEntityCategories(entity.get('id'), associations, entityKey, categories, includeParents)));

export const entitiesSetAssociated = (entities, entityKey, associations, associationKey, associationId) => entities && entities.map((entity) => entitySetAssociated(entity, entityKey, associations, associationKey, associationId));

export const entitySetAssociated = (entity, entityKey, associations, associationKey, associationId) => {
  const entityAssociation = associations.find((association) => attributesEqual(association.getIn(['attributes', entityKey]), entity.get('id'))
    && attributesEqual(association.getIn(['attributes', associationKey]), associationId));
  return entity.set('associated', entityAssociation || false);
};

export const entitiesIsAssociated = (entities, entityKey, associations, associationKey, associationId) => entities && associations && entities.filter((entity) => associations.find((association) => attributesEqual(association.getIn(['attributes', entityKey]), entity.get('id'))
      && attributesEqual(association.getIn(['attributes', associationKey]), associationId)));
export const entitiesSetSingle = (entities, related, key, relatedKey) => entities && entities.map((entity) => entitySetSingle(entity, related, key, relatedKey));

export const entitySetSingle = (entity, related, key, relatedKey) => entity && entity.set(key,
  related.find((r) => attributesEqual(entity.getIn(['attributes', relatedKey]), r.get('id'))));

export const entitySetUser = (entity, users) => entity && entitySetSingle(entity, users, 'user', 'last_modified_user_id');

export const entitySetSingles = (entity, singles) => entity && singles.reduce((memo, { related, key, relatedKey }) => entitySetSingle(memo, related, key, relatedKey), entity);

// taxonomies or parent taxonomies
export const filterTaxonomies = (taxonomies, tagsKey, includeParents = true) => taxonomies
  && taxonomies.filter((tax, key, list) => tax.getIn(['attributes', tagsKey])
    && (
      includeParents
      // only non-parents
      || !list.some((other) => attributesEqual(tax.get('id'), other.getIn(['attributes', 'parent_id']))
        && other.getIn(['attributes', tagsKey]))
    ));

export const prepareTaxonomiesIsAssociated = (
  taxonomies,
  categories,
  associations,
  tagsKey,
  associationKey,
  associationId,
  includeParents = true,
) => taxonomies
  && filterTaxonomies(taxonomies, tagsKey, includeParents)
    .map((tax) => tax
      .set('tags', tax.getIn(['attributes', tagsKey]))
      .set('categories', categories
        .filter((cat, key, list) => {
          if (attributesEqual(cat.getIn(['attributes', 'taxonomy_id']), tax.get('id'))) {
            if (associations.find((association) => attributesEqual(association.getIn(['attributes', 'category_id']), cat.get('id'))
            && attributesEqual(association.getIn(['attributes', associationKey]), associationId))) {
              return true;
            }
            // if any of categories children
            const catChildren = list.filter((item) => attributesEqual(item.getIn(['attributes', 'parent_id']), cat.get('id')));
            if (catChildren.some((child) => associations.find((association) => attributesEqual(association.getIn(['attributes', 'category_id']), child.get('id'))
            && attributesEqual(association.getIn(['attributes', associationKey]), associationId)))) {
              return true;
            }
            return false;
          }
          return false;
        })));

export const prepareTaxonomiesAssociated = (
  taxonomies,
  categories,
  associations,
  tagsKey,
  associationKey,
  associationId,
  includeParents = true,
) => taxonomies
  && filterTaxonomies(taxonomies, tagsKey, includeParents)
    .map((tax) => tax
      .set('tags', tax.getIn(['attributes', tagsKey]))
      .set('categories', entitiesSetAssociated(
        categories.filter((cat) => attributesEqual(cat.getIn(['attributes', 'taxonomy_id']), tax.get('id'))
        && (!cat.getIn(['attributes', 'user_only']) || tagsKey === 'tags_users')),
        'category_id',
        associations,
        associationKey,
        associationId
      )));

// TODO deal with conflicts
export const prepareTaxonomiesMultiple = (
  taxonomies,
  categories,
  tagsKeys,
  includeParents = true,
) => reduce(
  tagsKeys,
  (memo, tagsKey) => memo.merge(prepareTaxonomies(taxonomies, categories, tagsKey, includeParents)),
  Map(),
);

export const prepareTaxonomies = (taxonomies, categories, tagsKey, includeParents = true) => taxonomies
  && filterTaxonomies(taxonomies, tagsKey, includeParents)
    .map((tax) => tax
      .set('tags', tax.getIn(['attributes', tagsKey]))
      .set('categories',
        categories.filter((cat) => attributesEqual(cat.getIn(['attributes', 'taxonomy_id']), tax.get('id'))
        && (!cat.getIn(['attributes', 'user_only']) || tagsKey === 'tags_users'))));

export const prepareCategory = (category, users, taxonomies) => category
  && entitySetUser(
    category.set(
      'taxonomy',
      taxonomies.find(
        (tax) => attributesEqual(category.getIn(['attributes', 'taxonomy_id']), tax.get('id')),
      ),
    ),
    users,
  );

export const usersByRole = (users, userRoles, roleId) => users && users
  .filter((user) => {
    const roles = userRoles.filter((association) => attributesEqual(association.getIn(['attributes', 'role_id']), roleId)
      && attributesEqual(association.getIn(['attributes', 'user_id']), user.get('id')));
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

export const getEntityReference = (entity, defaultToId = true) => defaultToId
  ? (entity.getIn(['attributes', 'reference'])
      || entity.getIn(['attributes', 'number'])
      || entity.get('id'))
  : (entity.getIn(['attributes', 'reference']) || null);

export const getCategoryShortTitle = (category) => truncateText(
  category.getIn(['attributes', 'short_title']) && category.getIn(['attributes', 'short_title']).trim().length > 0
    ? category.getIn(['attributes', 'short_title'])
    : category.getIn(['attributes', 'title']) || category.getIn(['attributes', 'name']),
  TEXT_TRUNCATE.ENTITY_TAG
);

export const getCategoryTitle = (cat) => cat.getIn(['attributes', 'reference'])
  ? `${cat.getIn(['attributes', 'reference'])}. ${cat.getIn(['attributes', 'title']) || cat.getIn(['attributes', 'name'])}`
  : cat.getIn(['attributes', 'title']) || cat.getIn(['attributes', 'name']);

export const getEntityParentId = (cat) => cat.getIn(['attributes', 'parent_id']) && cat.getIn(['attributes', 'parent_id']).toString();

export const getEntityCategories = (entityId, associations, associationKey, categories, includeParents = true) => {
  // directly associated categories
  const categoryIds = associations && associations
    .filter((association) => attributesEqual(association.getIn(['attributes', associationKey]), entityId))
    .map((association) => association.getIn(['attributes', 'category_id']));
  if (categories && includeParents) {
    // include parent categories of associated categories when categories present
    return categoryIds && categoryIds
      .reduce((memo, id, key) => {
        // if any of categories children
        const category = categories.get(id.toString());
        const parentId = category && category.getIn(['attributes', 'parent_id']);
        return parentId
          ? memo.set(`${key}-${id}`, parseInt(parentId, 10))
          : memo;
      }, categoryIds);
  }
  return categoryIds;
};

export const getEntityConnections = (entityId, associations, associationKey, entityKey, connections) => associations
  .filter((association) => attributesEqual(association.getIn(['attributes', entityKey]), entityId)
    && connections.get(association.getIn(['attributes', associationKey]).toString()))
  .map((association) => association.getIn(['attributes', associationKey]));

export const getEntityConnectionsByFw = (entityId, associations, associationKey, entityKey, connections) => connections
  .groupBy((c) => c.getIn(['attributes', 'framework_id']).toString())
  .map((connectionsForFw) => associations
    .filter((association) => attributesEqual(association.getIn(['attributes', entityKey]), entityId)
        && connectionsForFw.get(association.getIn(['attributes', associationKey]).toString()))
    .map((association) => association.getIn(['attributes', associationKey])));

export const getTaxonomyCategories = (taxonomy, categories, relationship, connections) => categories
  .filter((category) => attributesEqual(category.getIn(['attributes', 'taxonomy_id']), taxonomy.get('id')))
  .map((category) => {
    // figure out child categories if not directly tagging connection
    const childCategories = categories.filter(
      (item) => attributesEqual(item.getIn(['attributes', 'parent_id']), category.get('id')),
    );
    return category.set(relationship.path,
      relationship.associations
        .filter((association) => {
          if (!connections.get(association.getIn(['attributes', relationship.key]).toString())) {
            return false;
          }
          return (!childCategories || childCategories.size === 0)
            ? attributesEqual(association.getIn(['attributes', 'category_id']), category.get('id'))
            : childCategories.some((child) => attributesEqual(association.getIn(['attributes', 'category_id']), child.get('id')));
        })
        .map((association) => association.getIn(['attributes', relationship.key])));
  });
