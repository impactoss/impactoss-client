import { find, forEach, map, reduce } from 'lodash/collection';

export const makeActiveEditOptions = (entities, props) => {
  // create edit options
  switch (props.activeEditOption.group) {
    case 'taxonomies':
      return makeTaxonomyEditOptions(entities, props);
    case 'connections':
      return makeConnectionEditOptions(entities, props);
    case 'attributes':
      return makeAttributeEditOptions(entities, props);
    default:
      return null;
  }
};

export const makeAttributeEditOptions = (entities, { edits, activeEditOption }) => {
  const editOptions = {
    groupId: 'attributes',
    search: true,
    options: {},
    selectedCount: entities.length,
  };

  const option = find(edits.attributes.options, (o) => o.attribute === activeEditOption.optionId);
  if (option) {
    editOptions.title = option.label;
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
        all: count === entities.length,
        none: count === 0,
        some: count > 0 && count < entities.length,
        count,
      };
    });
  }
  return editOptions;
};

export const makeTaxonomyEditOptions = (entities, { taxonomies, activeEditOption }) => {
  const editOptions = {
    groupId: 'taxonomies',
    search: true,
    options: {},
    selectedCount: entities.length,
  };

  const taxonomy = taxonomies[parseInt(activeEditOption.optionId, 10)];
  if (taxonomy) {
    editOptions.title = taxonomy.attributes.title;
    forEach(taxonomy.categories, (category) => {
      const count = reduce(entities, (counter, entity) => {
        const categoryIds = entity.taxonomies
          ? map(map(Object.values(entity.taxonomies), 'attributes'), (attribute) => attribute.category_id.toString())
          : [];
        return categoryIds && categoryIds.indexOf(category.id) > -1 ? counter + 1 : counter;
      }, 0);
      editOptions.options[category.id] = {
        label: category.attributes.title,
        value: category.id,
        all: count === entities.length,
        none: count === 0,
        some: count > 0 && count < entities.length,
        count,
      };
    });
  }
  return editOptions;
};

export const makeConnectionEditOptions = (entities, { edits, connections, activeEditOption }) => {
  const editOptions = {
    groupId: 'connections',
    search: true,
    options: {},
    selectedCount: entities.length,
  };

  const option = find(edits.connections.options, (o) => o.path === activeEditOption.optionId);
  if (option) {
    editOptions.title = option.label;
    editOptions.path = option.connectPath;
    forEach(connections[option.path], (connection) => {
      const count = reduce(entities, (counter, entity) => {
        const connectedIds = entity[option.path]
          ? map(map(Object.values(entity[option.path]), 'attributes'), (attribute) => attribute[option.key].toString())
          : null;
        return connectedIds && connectedIds.indexOf(connection.id) > -1 ? counter + 1 : counter;
      }, 0);
      editOptions.options[connection.id] = {
        label: connection.attributes.title,
        value: connection.id,
        all: count === entities.length,
        none: count === 0,
        some: count > 0 && count < entities.length,
        count,
      };
    });
  }
  return editOptions;
};
