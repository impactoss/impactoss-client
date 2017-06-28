import { find, forEach, map, reduce } from 'lodash/collection';
import { STATES as CHECKBOX } from 'components/forms/IndeterminateCheckbox';

export const checkedState = (count, length) => {
  if (count === length) {
    return CHECKBOX.CHECKED;
  } else if (count < length && count > 0) {
    return CHECKBOX.INDETERMINATE;
  }
  return CHECKBOX.UNCHECKED;
};

export const makeActiveEditOptions = (entities, edits, activeEditOption, taxonomies, connections, messages) => {
  // create edit options
  switch (activeEditOption.group) {
    case 'taxonomies':
      return makeTaxonomyEditOptions(entities, taxonomies, activeEditOption, messages);
    case 'connections':
      return makeConnectionEditOptions(entities, edits, connections, activeEditOption, messages);
    case 'attributes':
      return makeAttributeEditOptions(entities, edits, activeEditOption, messages);
    default:
      return null;
  }
};

export const makeAttributeEditOptions = (entities, edits, activeEditOption, messages) => {
  const editOptions = {
    groupId: 'attributes',
    search: true,
    options: {},
    selectedCount: entities.length,
    multiple: false,
    required: true,
  };

  const option = find(edits.attributes.options, (o) => o.attribute === activeEditOption.optionId);
  if (option) {
    editOptions.title = messages.title;
    editOptions.filter = option.filter;
    forEach(option.options, (attributeOption) => {
      const count = reduce(entities, (counter, entity) =>
        typeof entity.attributes[option.attribute] !== 'undefined'
          && entity.attributes[option.attribute].toString() === attributeOption.value.toString()
          ? counter + 1
          : counter
      , 0);

      editOptions.options[attributeOption.value] = {
        label: attributeOption.label,
        value: attributeOption.value,
        attribute: option.attribute,
        checked: checkedState(count, entities.length),
        order: attributeOption.label,
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
    selectedCount: entities.length,
    multiple: true,
    required: false,
    filter: true,
  };

  const taxonomy = taxonomies[parseInt(activeEditOption.optionId, 10)];
  if (taxonomy) {
    editOptions.title = messages.title;
    editOptions.multiple = taxonomy.attributes.allow_multiple;
    editOptions.filter = taxonomy.attributes.filter;
    forEach(taxonomy.categories, (category) => {
      const count = reduce(entities, (counter, entity) => {
        const categoryIds = entity.taxonomies
          ? map(map(Object.values(entity.taxonomies), 'attributes'), (attribute) => attribute.category_id.toString())
          : [];
        return categoryIds && categoryIds.indexOf(category.id) > -1 ? counter + 1 : counter;
      }, 0);
      const label = category.attributes.title || category.attributes.name;
      editOptions.options[category.id] = {
        label,
        value: category.id,
        checked: checkedState(count, entities.length),
        order: label,
      };
    });
  }
  return editOptions;
};

export const makeConnectionEditOptions = (entities, edits, connections, activeEditOption, messages) => {
  const editOptions = {
    groupId: 'connections',
    search: true,
    options: {},
    selectedCount: entities.length,
    multiple: true,
    required: false,
    filter: true,
  };

  const option = find(edits.connections.options, (o) => o.path === activeEditOption.optionId);
  if (option) {
    editOptions.title = messages.title;
    editOptions.path = option.connectPath;
    editOptions.filter = option.filter;
    forEach(connections[option.path], (connection) => {
      const count = reduce(entities, (counter, entity) => {
        const connectedIds = entity[option.path]
          ? map(map(Object.values(entity[option.path]), 'attributes'), (attribute) => attribute[option.key].toString())
          : null;
        return connectedIds && connectedIds.indexOf(connection.id) > -1 ? counter + 1 : counter;
      }, 0);
      const reference = connection.attributes.number || connection.id;
      editOptions.options[connection.id] = {
        label: connection.attributes.title || connection.attributes.friendly_name || connection.attributes.name,
        reference,
        value: connection.id,
        checked: checkedState(count, entities.length),
        order: reference,
      };
    });
  }
  return editOptions;
};
