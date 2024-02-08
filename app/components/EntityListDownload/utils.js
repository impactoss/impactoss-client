import qe from 'utils/quasi-equals';
import appMessages from 'containers/App/messages';

import { snakeCase } from 'lodash/string';

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

const prepActionData = ({
  entity, // Map
  actions, // Map
  data,
}) => {
  const entityActionIds = entity.get('measures').size > 0
    && entity
      .get('measures')
      .map((actionId) => actionId);
  let actionsValue = '';
  if (entityActionIds) {
    actionsValue = entityActionIds.reduce((memo, actionId) => {
      const action = actions.get(actionId.toString());
      if (action) {
        const title = action.getIn(['attributes', 'title']);
        actionsValue = addWarnings({
          value: title,
          entity: action,
        });
        return memo === ''
          ? actionsValue
          : `${memo}${IN_CELL_SEPARATOR}${actionsValue}`;
      }
      return memo;
    }, '');
  }
  return ({
    ...data,
    connected_actions: sanitiseText(actionsValue),
  });
};

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

const prepRecommendationDataColumns = ({
  entity, // Map
  recommendations, // Map
  data,
  framework,
}) => {
  const entityRecommendationIds = entity.getIn(['recommendationsByFw', parseInt(framework, 10)]);
  let recommendationValue = '';
  if (entityRecommendationIds) {
    recommendationValue = entityRecommendationIds.reduce((memo2, recommendationId) => {
      const recommendation = recommendations.get(recommendationId.toString());
      if (recommendation) {
        const title = recommendation.getIn(['attributes', 'title']);
        recommendationValue = addWarnings({
          value: title,
          entity: recommendation,
        });
        return memo2 === ''
          ? recommendationValue
          : `${memo2}${IN_CELL_SEPARATOR}${recommendationValue}`;
      }
      return memo2;
    }, '');
  }
  return ({
    ...data,
    connected_recommendations: sanitiseText(recommendationValue),
  });
};
const prepTaxonomyDataColumns = ({
  taxonomyColumns,
  taxonomies,
  entity,
  data,
}) => Object.keys(taxonomyColumns).reduce((memo, attKey) => {
  if (!taxonomyColumns[attKey].active) {
    return memo;
  }
  let categoryValue = '';
  const entityTaxonomy = entity.getIn(['categories', attKey]);
  if (entityTaxonomy) {
    categoryValue = taxonomies
      .reduce((memo2, tax) => {
        let entityCategory = '';
        if (tax.get('categories').has(entityTaxonomy.toString())) {
          entityCategory = tax.getIn(['categories', entityTaxonomy.toString(), 'attributes', 'title']);
          return memo2 === ''
            ? entityCategory
            : `${memo2}${IN_CELL_SEPARATOR}${entityCategory}`;
        }
        return memo2;
      }, '');
  }
  return ({
    ...memo,
    [attKey]: categoryValue,
  });
}, data);


const prepIndicatorDataColumns = ({
  entity, // Map
  indicators, // Map
  data,
}) => indicators.reduce((memo, indicator) => {
  const indicatorId = indicator.get('id');
  const indicatorConnection = entity.get('indicators').size > 0
    && entity.get('indicators').find((connection) => qe(connection, indicatorId));
  let value = '';
  if (indicatorConnection) {
    // value = indicator.getIn(['attributes', 'title']);
    value = 'true';
  }
  return ({
    ...memo,
    [`indicator_${indicator.get('id')}`]: value,
  });
}, data);

const prepIndicatorDataAsRows = ({
  entity, // Map
  indicators, // Map
  dataRows, // array of entity rows (i.e. for each actor and action)
}) => {
  const entityIndicatorConnections = entity.get('indicators');
  if (entityIndicatorConnections) {
    // for each indicator
    const dataIndicatorRows = entityIndicatorConnections.reduce((memo, indicatorConnection) => {
      const indicator = indicators.get(indicatorConnection.toString());
      // and for each row: add indicator columns
      if (indicator) {
        const dataRowsIndicator = dataRows.reduce((memo2, data) => {
          const dataRow = {
            ...data,
            indicator_id: indicator.get('id'),
            indicator_title: sanitiseText(indicator.getIn(['attributes', 'title'])),
            indicator_draft: !!indicator.getIn(['attributes', 'draft']),
            indicator_private: !!indicator.getIn(['attributes', 'private']),
          };
          return [
            ...memo2,
            dataRow,
          ];
        }, []);
        return [
          ...memo,
          ...dataRowsIndicator,
        ];
      }
      return memo;
    }, []);
    return dataIndicatorRows.length > 0 ? dataIndicatorRows : dataRows;
  }
  return dataRows;
};
export const prepareDataForMeasures = ({
  entities,
  relationships,
  attributes,
  hasRecommendations,
  hasIndicators,
  indicatorsAsRows,
  hasTaxonomies,
  taxonomyColumns,
  taxonomies,
  framework,
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
  if (hasRecommendations) {
    data = prepRecommendationDataColumns({
      entity,
      recommendations: relationships && relationships.get('recommendations'),
      data,
      framework,
    });
  }
  if (hasIndicators && !indicatorsAsRows) {
    data = prepIndicatorDataColumns({
      entity,
      indicators: relationships && relationships.get('indicators'),
      data,
    });
  }
  let dataRows = [data];
  if (hasIndicators && indicatorsAsRows) {
    dataRows = prepIndicatorDataAsRows({
      entity,
      indicators: relationships && relationships.get('indicators'),
      dataRows,
    });
  }
  return [...memo, ...dataRows];
}, []);

export const prepareDataForIndicators = ({
  entities,
  relationships,
  attributes,
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
  /* if (hasActions) {
     data = prepActionData({
       entity,
       actions: relationships && relationships.get('measures'),
       data,
     });
   } */
  return [...memo, data];
}, []);

export const prepareDataForRecommendations = ({
  entities,
  relationships,
  attributes,
  hasActions,
  hasIndicators,
  hasTaxonomies,
  taxonomyColumns,
  taxonomies,
  indicatorsAsRows,
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
  if (hasActions) {
    data = prepActionData({
      entity,
      actions: relationships && relationships.get('measures'),
      data,
    });
  }
  if (hasIndicators && !indicatorsAsRows) {
    data = prepIndicatorDataColumns({
      entity,
      indicators: relationships && relationships.get('indicators'),
      data,
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
  let dataRows = [data];

  if (hasIndicators && indicatorsAsRows) {
    dataRows = prepIndicatorDataAsRows({
      entity,
      indicators: relationships && relationships.get('indicators'),
      dataRows,
    });
  }
  return [...memo, ...dataRows];
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
