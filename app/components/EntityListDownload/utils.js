// import qe from 'utils/quasi-equals';
import appMessages from 'containers/App/messages';

// const IN_CELL_SEPARATOR = ', \n';
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

export const prepareDataForRecommendations = ({
  // typeId,
  // config,
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
