
import appMessages from 'containers/App/messages';

import { snakeCase } from 'lodash/string';
import { Set } from 'immutable';

// const IN_CELL_SEPARATOR = ', \n';
const IN_CELL_SEPARATOR = ', ';

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
  if (val.startsWith('-') || val.startsWith('+')) {
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

const getValue = ({
  key, attribute, entity, typeNames, relationships,
}) => {
  const val = entity.getIn(['attributes', key]) || '';
  if (key === 'measuretype_id' && typeNames) {
    return typeNames.actiontypes[val] || val;
  }
  if (key === 'actortype_id' && typeNames) {
    return typeNames.actortypes[val] || val;
  }
  if (attribute.type === 'bool') {
    return val || false;
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
      const title = connectedEntity.getIn(['attributes', 'title']) || connectedEntity.getIn(['attributes', 'name']);
      if (title) {
        const email = connectedEntity.getIn(['attributes', 'email']);
        if (email) {
          return `${title} (${email})`;
        }
        return title;
      }
    }
  }
  return val;
};
export const getDefaultEntityTypes = (list, columnType) => list.reduce((memo, type) => {
  const typeId = type.get('id');
  const label = type.getIn(['attributes', 'title']);
  return {
    ...memo,
    [typeId]: {
      id: typeId,
      label,
      active: false,
      column: `${columnType}_${snakeCase(label)}`,
    },
  };
}, {});
export const getIndicatorColumns = (indicatorsAsRows, connections, isAdmin) => {
  let csvColumns = [];
  if (!indicatorsAsRows) {
    const indicatorColumns = connections.get('indicators').reduce((memo, indicator) => {
      let displayName = `indicator_${indicator.get('id')}`;
      if (indicator.getIn(['attributes', 'draft'])) {
        displayName += '_DRAFT';
      }
      if (indicator.getIn(['attributes', 'private'])) {
        displayName += '_PRIVATE';
      }
      return [
        ...memo,
        {
          id: `indicator_${indicator.get('id')}`,
          displayName,
        },
      ];
    }, csvColumns);
    csvColumns = [
      ...csvColumns,
      ...indicatorColumns,
    ];
  } else {
    csvColumns = [
      ...csvColumns,
      { id: 'indicator_id', displayName: 'indicator_id' },
      { id: 'indicator_title', displayName: 'indicator_title' },
    ];
    if (isAdmin) {
      csvColumns = [
        ...csvColumns,
        { id: 'indicator_draft', displayName: 'indicator_draft' },
        { id: 'indicator_private', displayName: 'indicator_private' },
      ];
    }
  }
  return csvColumns;
};
const prepConnnectionData = ({
  entity,
  relationships,
  connectionTypes,
  data,
}) => Object.keys(connectionTypes)
  .reduce((memo, connectionType) => {
    if (!connectionTypes[connectionType].active) {
      return memo;
    }
    const entityConnectionIds = entity.get(connectionType).size > 0
      && entity
        .get(connectionType)
        .map((typeId) => typeId);
    let connectionsValue = '';
    if (entityConnectionIds) {
      connectionsValue = entityConnectionIds.reduce((memo2, typeId) => {
        const connection = relationships.getIn([connectionType, typeId.toString()]);
        if (connection) {
          const title = connection.getIn(['attributes', 'title']);
          connectionsValue = addWarnings({
            value: title,
            entity: connection,
          });
          return memo2 === ''
            ? connectionsValue
            : `${memo2}${IN_CELL_SEPARATOR}${connectionsValue}`;
        }
        return memo2;
      }, '');
    }
    return ({
      ...memo,
      [`connected_${connectionType}`]: sanitiseText(connectionsValue),
    });
  }, data);

const prepAttributeData = ({
  entity,
  attributes,
  typeNames,
  data,
  relationships,
}) => Object.keys(attributes).reduce((memo, attKey) => {
  if (!attributes[attKey].active) {
    return memo;
  }
  const value = getValue({
    key: attKey,
    attribute: attributes[attKey],
    entity,
    typeNames,
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
    const entityCategories = Set(entity.get('categories').valueSeq().map((key) => String(key)));
    const activeTaxonomyCategories = Set(taxonomies.getIn([attKey, 'categories']).keySeq());
    const intersect = entityCategories.intersect(activeTaxonomyCategories);
    let categoryValue = '';
    if (intersect.size > 0) {
      categoryValue = intersect.reduce((memo2, categoryId) => {
        const entityCategory = taxonomies.getIn([attKey, 'categories', categoryId, 'attributes', 'title']);
        return memo2 === ''
          ? entityCategory
          : `${memo2}${IN_CELL_SEPARATOR}${entityCategory}`;
      }, '');
    }
    return ({
      ...memo,
      [taxonomyColumns[attKey].column]: categoryValue,
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
  isAdmin,
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
      if (
        !isAdmin
        && (
          attValue.adminOnly
          || (attValue.adminOnlyForTypes && attValue.adminOnlyForTypes.indexOf(typeId) > -1)
        )
      ) {
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
