import qe from 'utils/quasi-equals';
import appMessages from 'containers/App/messages';

const IN_CELL_SEPARATOR = ', \n';
// const IN_CELL_SEPARATOR = ', ';

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

const prepActionDataAsRows = ({
  entity, // Map
  actiontypes,
  actions, // Map
  data,
}) => {
  if (entity.get('measures') && actiontypes) {
    const dataRows = Object.keys(actiontypes).reduce((memo, actiontypeId) => {
      if (!actiontypes[actiontypeId].active) {
        return memo;
      }
      const entityActionIds = entity.get('measures').size > 0
        && entity
          .get('measures')
          .filter((actionId) => actionId === parseInt(actiontypeId, 10));

      if (entityActionIds) {
        const dataTypeRows = entityActionIds.reduce((memo2, actionId) => {
          const action = actions.get(actionId.toString());
          const dataRow = {
            ...data,
            action_id: actionId,
            action_title: sanitiseText(action.getIn(['attributes', 'title'])),
            action_draft: !!action.getIn(['attributes', 'draft']),
            action_private: !!action.getIn(['attributes', 'private']),
            // action_target_date: sanitiseText(action.getIn(['attributes', 'target_date'])),
          };
          return [
            ...memo2,
            dataRow,
          ];
        }, []);
        return [
          ...memo,
          ...dataTypeRows,
        ];
      }
      return [
        ...memo,
      ];
    }, []);
    return dataRows.length > 0 ? dataRows : [data];
  }
  return [data];
};

const prepActionData = ({
  entity, // Map
  actiontypes,
  actions, // Map
  data,
}) => Object.keys(actiontypes).reduce((memo, actiontypeId) => {
  if (!actiontypes[actiontypeId].active) {
    return memo;
  }
  const entityActionIds = entity.get('measures').size > 0
    && entity
      .get('measures')
      .filter((actionId) => actionId === parseInt(actiontypeId, 10));

  let actionsValue = '';
  if (entityActionIds) {
    actionsValue = entityActionIds.reduce((memo2, actionId) => {
      const action = actions.get(actionId.toString());
      if (action) {
        const title = action.getIn(['attributes', 'title']);
        const code = action.getIn(['attributes', 'code']);
        let actionValue = (code && code !== '') ? `${code}|${title}` : title;
        actionValue = addWarnings({
          value: actionValue,
          entity: action,
        });
        return memo2 === ''
          ? actionValue
          : `${memo2}${IN_CELL_SEPARATOR}${actionValue}`;
      }
      return memo2;
    }, '');
  }
  return ({
    ...memo,
    [`actions_${actiontypeId}`]: sanitiseText(actionsValue),
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

const getIndicatorValue = ({ entity, indicatorId }) => {
  const indicatorConnection = entity.get('indicators').size > 0
    && entity.get('indicators').find((connection) => qe(connection.get('id'), indicatorId));

  if (indicatorConnection) {
    return indicatorConnection.get('supportlevel_id') || '';
  }
  return '';
};

const prepIndicatorDataColumns = ({
  entity, // Map
  indicators, // Map
  data,
}) => indicators.reduce((memo, indicator) => {
  const value = getIndicatorValue({
    entity,
    indicatorId: indicator.get('id'),
  });

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
      const indicator = indicators.get(indicatorConnection.get('indicator_id').toString());
      // and for each row: add indicator columns
      if (indicator) {
        const dataRowsIndicator = dataRows.reduce((memo2, data) => {
          const dataRow = {
            ...data,
            indicator_id: indicatorConnection.get('id'),
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

export const prepareDataForRecommendations = ({
  // typeId,
  // config,
  entities,
  relationships,
  attributes,
  // actions
  hasActions,
  actiontypes,
  actionsAsRows,
  // indicators
  hasIndicators,
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
  if (hasActions && !actionsAsRows) {
    data = prepActionData({
      entity,
      actiontypes,
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
  let dataRows = [data];
  if (hasActions && actionsAsRows) {
    dataRows = prepActionDataAsRows({
      entity,
      actiontypes,
      actions: relationships && relationships.get('measures'),
      data,
    });
  }
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
