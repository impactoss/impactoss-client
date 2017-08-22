import { find, forEach } from 'lodash/collection';
import { STATES as CHECKBOX } from 'components/forms/IndeterminateCheckbox';

import {
  testEntityEntityAssociation,
  testEntityCategoryAssociation,
  getEntityTitle,
  getEntityReference,
} from 'utils/entities';

import { makeTagFilterGroups } from 'utils/forms';

export const checkedState = (count, length) => {
  if (count === length) {
    return CHECKBOX.CHECKED;
  } else if (count < length && count > 0) {
    return CHECKBOX.INDETERMINATE;
  }
  return CHECKBOX.UNCHECKED;
};

export const makeActiveEditOptions = (entities, config, activeEditOption, taxonomies, connections, connectedTaxonomies, messages) => {
  // create edit options
  switch (activeEditOption.group) {
    case 'taxonomies':
      return makeTaxonomyEditOptions(entities, taxonomies, activeEditOption, messages);
    case 'connections':
      return makeConnectionEditOptions(entities, config, connections, connectedTaxonomies, activeEditOption, messages);
    case 'attributes':
      return makeAttributeEditOptions(entities, config, activeEditOption, messages);
    default:
      return null;
  }
};

export const makeAttributeEditOptions = (entities, config, activeEditOption, messages) => {
  const editOptions = {
    groupId: 'attributes',
    search: true,
    options: {},
    selectedCount: entities.size,
    multiple: false,
    required: true,
    selectAll: false,
  };

  const option = find(config.attributes.options, (o) => o.attribute === activeEditOption.optionId);
  if (option) {
    editOptions.title = messages.title;
    editOptions.search = option.search;
    forEach(option.options, (attributeOption) => {
      const count = entities.reduce((counter, entity) =>
        typeof entity.getIn(['attributes', option.attribute]) !== 'undefined'
          && entity.getIn(['attributes', option.attribute]) !== null
          && entity.getIn(['attributes', option.attribute]).toString() === attributeOption.value.toString()
          ? counter + 1
          : counter
      , 0);

      editOptions.options[attributeOption.value] = {
        label: attributeOption.label,
        value: attributeOption.value,
        attribute: option.attribute,
        checked: checkedState(count, entities.size),
      };
    });
  }
  return editOptions;
};

export const makeTaxonomyEditOptions = (entities, taxonomies, activeEditOption, messages) => {
  const editOptions = {
    groupId: 'taxonomies',
    search: true,
    options: {},
    selectedCount: entities.size,
    multiple: true,
    required: false,
    selectAll: true,
  };

  const taxonomy = taxonomies.get(activeEditOption.optionId);
  if (taxonomy) {
    editOptions.title = messages.title;
    editOptions.multiple = taxonomy.getIn(['attributes', 'allow_multiple']);
    editOptions.search = taxonomy.getIn(['attributes', 'search']);
    taxonomy.get('categories').forEach((category) => {
      const count = entities.reduce((counter, entity) =>
        testEntityCategoryAssociation(entity, category.get('id')) ? counter + 1 : counter
      , 0);
      editOptions.options[category.get('id')] = {
        reference: getEntityReference(category, false),
        label: getEntityTitle(category),
        value: category.get('id'),
        checked: checkedState(count, entities.size),
      };
    });
  }
  return editOptions;
};

export const makeConnectionEditOptions = (entities, config, connections, connectedTaxonomies, activeEditOption, messages) => {
  const option = find(config.connections.options, (o) => o.path === activeEditOption.optionId);

  const editOptions = {
    groupId: 'connections',
    search: true,
    options: {},
    selectedCount: entities.size,
    multiple: true,
    required: false,
    advanced: true,
    selectAll: true,
    tagFilterGroups: option && makeTagFilterGroups(connectedTaxonomies),
  };

  if (option) {
    editOptions.title = messages.title;
    editOptions.path = option.connectPath;
    editOptions.search = option.search;
    connections.get(option.path).forEach((connection) => {
      const count = entities.reduce((counter, entity) =>
        testEntityEntityAssociation(entity, option.path, connection.get('id')) ? counter + 1 : counter
      , 0);
      editOptions.options[connection.get('id')] = {
        reference: getEntityReference(connection),
        label: getEntityTitle(connection),
        value: connection.get('id'),
        checked: checkedState(count, entities.size),
        tags: connection.get('categories'),
      };
    });
  }
  return editOptions;
};
