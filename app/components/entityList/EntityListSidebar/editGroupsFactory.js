import { reduce } from 'lodash/collection';

export const makeEditGroups = (
  edits,
  taxonomies,
  activeEditOption,
  messages,
  formatLabel
) => {
  const editGroups = {};

  // taxonomy option group
  if (edits.taxonomies && taxonomies) {
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
          path: edits.taxonomies.connectPath,
          key: edits.taxonomies.key,
          ownKey: edits.taxonomies.ownKey,
          active: !!activeEditOption && activeEditOption.optionId === taxonomy.get('id'),
        },
      }), {}),
    };
  }

  // connections option group
  if (edits.connections) {
    // first prepare taxonomy options
    editGroups.connections = {
      id: 'connections', // filterGroupId
      label: messages.connections,
      show: true,
      options: reduce(edits.connections.options, (options, option) =>
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
          },
        }
        : options
      , {}),
    };
  }

  // attributes
  if (edits.attributes) {
    // first prepare taxonomy options
    editGroups.attributes = {
      id: 'attributes', // filterGroupId
      label: messages.attributes,
      show: true,
      options: reduce(edits.attributes.options, (options, option) =>
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
