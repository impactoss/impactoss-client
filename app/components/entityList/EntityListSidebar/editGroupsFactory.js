import { reduce } from 'lodash/collection';

export const makeEditGroups = (
  config,
  taxonomies,
  activeEditOption,
  messages,
  formatLabel
) => {
  const editGroups = {};

  // taxonomy option group
  if (config.taxonomies && taxonomies) {
    // first prepare taxonomy options
    editGroups.taxonomies = {
      id: 'taxonomies', // filterGroupId
      label: messages.taxonomies,
      show: true,
      icon: 'categories',
      options: taxonomies.reduce((taxOptions, taxonomy) => ({
        ...taxOptions,
        [taxonomy.get('id')]: {
          id: taxonomy.get('id'), // filterOptionId
          label: taxonomy.getIn(['attributes', 'title']),
          path: config.taxonomies.connectPath,
          key: config.taxonomies.key,
          ownKey: config.taxonomies.ownKey,
          active: !!activeEditOption && activeEditOption.optionId === taxonomy.get('id'),
          create: {
            path: 'categories',
            attributes: { taxonomy_id: taxonomy.get('id') },
          },
        },
      }), {}),
    };
  }

  // connections option group
  if (config.connections) {
    // first prepare taxonomy options
    editGroups.connections = {
      id: 'connections', // filterGroupId
      label: messages.connections,
      show: true,
      options: reduce(config.connections.options, (options, option) =>
        typeof option.edit === 'undefined' || option.edit
        ? {
          ...options,
          [option.path]: {
            id: option.path, // filterOptionId
            label: formatLabel(option.label),
            path: option.connectPath,
            key: option.key,
            ownKey: option.ownKey,
            icon: option.path,
            active: !!activeEditOption && activeEditOption.optionId === option.path,
            create: { path: option.path },
          },
        }
        : options
      , {}),
    };
  }

  // attributes
  if (config.attributes) {
    // first prepare taxonomy options
    editGroups.attributes = {
      id: 'attributes', // filterGroupId
      label: messages.attributes,
      show: true,
      options: reduce(config.attributes.options, (options, option) =>
        typeof option.edit === 'undefined' || option.edit
        ? {
          ...options,
          [option.attribute]: {
            id: option.attribute, // filterOptionId
            label: formatLabel(option.label),
            active: !!activeEditOption && activeEditOption.optionId === option.attribute,
          },
        }
        : options
      , {}),
    };
  }

  return editGroups;
};
