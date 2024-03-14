
import appMessages from 'containers/App/messages';

import { Set } from 'immutable';

const IN_CELL_SEPARATOR = '\n';
const IN_CELL_LIST_ITEM = '- ';

export const getDateSuffix = (datetime) => {
  const date = datetime ? new Date(datetime) : new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
};

const sanitiseText = (text) => {
  let val = text ? `${text}`.trim() : '';
  if (val.startsWith('+')) {
    val = `'${val}`;
  }
  return `"${val
    .replaceAll(/“/g, '"')
    .replaceAll(/”/g, '"')
    .replaceAll(/‘/g, "'")
    .replaceAll(/’/g, "'")
    .replaceAll(/"/g, '""')}"`;
};

const addWarnings = ({
  value,
  entity,
}) => {
  const draft = entity.getIn(['attributes', 'draft']);
  const isPrivate = entity.getIn(['attributes', 'private']);
  let warnings = [];
  if (draft || isPrivate) {
    if (draft) {
      warnings = [...warnings, 'draft'];
    }
    if (isPrivate) {
      warnings = [...warnings, 'private'];
    }
    return `${value} [${warnings.join('/')}]`;
  }
  return value;
};
export const getActiveCount = (types) => Object.keys(types).reduce((counter, attKey) => {
  if (types[attKey].active) return counter + 1;
  return counter;
}, 0);

const getAttributeValue = ({
  key, attribute, entity, relationships,
}) => {
  const val = entity.getIn(['attributes', key]) || '';
  if (attribute.type === 'bool') {
    return attribute.exportFlip
      ? !val || true
      : val || false;
  }
  if (attribute.type === 'date') {
    if (val && val !== '') {
      const date = new Date(val);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return '';
  }
  if (attribute.type === 'datetime') {
    if (val && val !== '') {
      return getDateSuffix(val);
    }
    return '';
  }
  if (
    attribute.type === 'markdown'
    || attribute.type === 'text'
  ) {
    return sanitiseText(val);
  }
  if (attribute.type === 'key' && relationships && relationships.get(attribute.table)) {
    const connectedEntity = relationships.getIn([attribute.table, `${val}`]);
    if (connectedEntity) {
      const title = connectedEntity.getIn(['attributes', 'title'])
        || connectedEntity.getIn(['attributes', 'name']);
      if (title) {
        // const email = connectedEntity.getIn(['attributes', 'email']);
        // if (email) {
        //   return `${title} (${email})`;
        // }
        return `${title} [${val}]`;
      }
    }
  }
  return val;
};


const prepConnnectionData = ({
  entity,
  relationships,
  connectionTypes,
  data,
}) => Object.keys(connectionTypes)
  .reduce((memo, connectionTypeKey) => {
    const type = connectionTypes[connectionTypeKey];
    if (!type.active) {
      return memo;
    }
    const connectionPath = type.path || type.id;
    const entityConnectionIds = entity.get(connectionPath)
      && entity
        .get(connectionPath)
        .map((typeId) => typeId);
    let connectionsValue = '';
    if (entityConnectionIds) {
      const multiple = entityConnectionIds.size > 1;
      connectionsValue = entityConnectionIds.reduce((memo2, typeId) => {
        const connection = relationships.getIn([connectionPath, typeId.toString()]);
        if (connection) {
          const title = connection.getIn(['attributes', 'title']);
          const ref = connection.getIn(['attributes', 'reference']) || connection.get('id');
          connectionsValue = addWarnings({
            value: `${title} [${ref}]`,
            entity: connection,
          });
          if (multiple) {
            connectionsValue = `${IN_CELL_LIST_ITEM}${connectionsValue}`;
          }
          return memo2 === ''
            ? connectionsValue
            : `${memo2}${IN_CELL_SEPARATOR}${connectionsValue}`;
        }
        return memo2;
      }, '');
    }
    return ({
      ...memo,
      [`connected_${type.column}`]: sanitiseText(connectionsValue),
    });
  }, data);

const prepAttributeData = ({
  entity,
  attributes,
  data,
  relationships,
}) => Object.keys(attributes).reduce((memo, attKey) => {
  if (!attributes[attKey].active) {
    return memo;
  }
  const value = getAttributeValue({
    key: attKey,
    attribute: attributes[attKey],
    entity,
    relationships,
  });
  return ({
    ...memo,
    [attKey]: value,
  });
}, data);

const prepTaxonomyDataColumns = ({
  taxonomyColumns,
  taxonomies,
  entity,
  data,
}) => Object.keys(taxonomyColumns)
  .reduce((memo, attKey) => {
    if (!taxonomyColumns[attKey].active) {
      return memo;
    }
    const entityCategories = entity.get('categories')
      && Set(entity.get('categories').valueSeq().map((key) => String(key)));
    const activeTaxonomyCategories = taxonomies.getIn([attKey, 'categories'])
      && Set(taxonomies.getIn([attKey, 'categories']).keySeq());

    let categoryValue = '';
    const intersect = entityCategories && activeTaxonomyCategories
      && entityCategories.intersect(activeTaxonomyCategories);
    if (intersect && intersect.size > 0) {
      const multiple = intersect.size > 1;
      categoryValue = intersect.reduce((memo2, categoryId) => {
        const entityCategory = taxonomies.getIn([attKey, 'categories', categoryId, 'attributes', 'title']);
        const entityCategoryShort = taxonomies.getIn([attKey, 'categories', categoryId, 'attributes', 'short_title']);
        let label = entityCategoryShort
          ? `${entityCategory} [${entityCategoryShort}]`
          : entityCategory;
        if (multiple) {
          label = `${IN_CELL_LIST_ITEM}${label}`;
        }
        return memo2 === ''
          ? label
          : `${memo2}${IN_CELL_SEPARATOR}${label}`;
      }, '');
    }
    return ({
      ...memo,
      [taxonomyColumns[attKey].column]: sanitiseText(categoryValue),
    });
  }, data);

export const prepareData = ({
  entities,
  relationships,
  attributes,
  hasTaxonomies,
  taxonomyColumns,
  taxonomies,
  connectionTypes,
  hasConnections,
}) => entities.reduce((memo, entity) => {
  let data = { id: entity.get('id') };
  // add attribute columns
  if (attributes) {
    data = prepAttributeData({
      data,
      entity,
      attributes,
      relationships,
    });
  }
  if (hasTaxonomies) {
    data = prepTaxonomyDataColumns({
      taxonomyColumns,
      taxonomies,
      entity,
      data,
    });
  }
  if (hasConnections) {
    data = prepConnnectionData({
      entity,
      relationships,
      connectionTypes,
      data,
    });
  }
  return [...memo, data];
}, []);

export const getAttributes = ({
  typeId,
  fieldAttributes,
  hasUserRole,
  intl,
}) => {
  if (fieldAttributes) {
    return Object.keys(fieldAttributes).reduce((memo, attKey) => {
      const attValue = fieldAttributes[attKey];
      const optional = typeof attValue.optional === 'boolean'
        ? attValue.optional
        : attValue.optional && attValue.optional.indexOf(typeId) > -1;
      const required = typeof attValue.required === 'boolean'
        ? attValue.required
        : attValue.required && attValue.required.indexOf(typeId) > -1;
      let passAdmin = true;
      if (attValue.roleExport && !hasUserRole[attValue.roleExport]) {
        passAdmin = false;
      }
      if (
        !attValue.skipExport
        // TODO: adminOnlyForTypes
        && passAdmin
        && (optional || required || (!attValue.optional && !attValue.required))
      ) {
        let active = false;
        if (attValue.exportDefault) {
          active = attValue.exportDefault;
        }
        if (attValue.exportRequired) {
          active = true;
        }
        const label = appMessages.attributes[attKey]
          ? `${intl.formatMessage(appMessages.attributes[attKey])}${attValue.exportRequired ? ' (required)' : ''}`
          : `title not working - ${attKey}`;
        return {
          ...memo,
          [attKey]: {
            ...attValue,
            active,
            column: attValue.exportColumn || attKey,
            label,
          },
        };
      }
      return memo;
    }, {});
  }
  return [];
};
