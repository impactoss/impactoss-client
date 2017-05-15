import { reduce } from 'lodash/collection';

export const makeEditGroups = (
  edits,
  taxonomies,
  connections,
  activeEditOption,
  messages
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
      options: reduce(Object.values(taxonomies), (taxOptions, taxonomy) => ({
        ...taxOptions,
        [taxonomy.id]: {
          id: taxonomy.id, // filterOptionId
          label: taxonomy.attributes.title,
          icon: `taxonomy_${taxonomy.id}`,
          path: edits.taxonomies.connectPath,
          key: edits.taxonomies.key,
          ownKey: edits.taxonomies.ownKey,
          active: !!activeEditOption && activeEditOption.optionId === taxonomy.id,
        },
      }), {}),
    };
  }

  // connections option group
  if (edits.connections && connections) {
    // first prepare taxonomy options
    editGroups.connections = {
      id: 'connections', // filterGroupId
      label: messages.connections,
      show: true,
      options: reduce(edits.connections.options, (options, option) => ({
        ...options,
        [option.path]: {
          id: option.path, // filterOptionId
          label: option.label,
          path: option.connectPath,
          key: option.key,
          ownKey: option.ownKey,
          icon: option.path === 'measures' ? 'actions' : option.path,
          active: !!activeEditOption && activeEditOption.optionId === option.path,
        },
      }), {}),
    };
  }

  // attributes
  if (edits.attributes) {
    // first prepare taxonomy options
    editGroups.attributes = {
      id: 'attributes', // filterGroupId
      label: messages.attributes,
      show: true,
      options: reduce(edits.attributes.options, (options, option) => ({
        ...options,
        [option.attribute]: {
          id: option.attribute, // filterOptionId
          label: option.label,
          active: !!activeEditOption && activeEditOption.optionId === option.attribute,
        },
      }), {}),
    };
  }

  return editGroups;
};
