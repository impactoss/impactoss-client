import { reduce } from 'lodash/collection';
import { sortEntities } from 'utils/sort';

export const makeEditGroups = (
  config,
  taxonomies,
  activeEditOption,
  hasUserRole,
  messages,
) => {
  const editGroups = {};

  // taxonomy option group
  if (config.taxonomies && taxonomies) {
    // first prepare taxonomy options
    editGroups.taxonomies = {
      id: 'taxonomies', // filterGroupId
      label: messages.taxonomyGroup,
      show: true,
      icon: 'categories',
      options: sortEntities(taxonomies, 'asc', 'priority').reduce((memo, taxonomy) =>
        memo.concat([
          {
            id: taxonomy.get('id'), // filterOptionId
            label: messages.taxonomies(taxonomy.get('id')),
            path: config.taxonomies.connectPath,
            key: config.taxonomies.key,
            ownKey: config.taxonomies.ownKey,
            active: !!activeEditOption && activeEditOption.optionId === taxonomy.get('id'),
            create: {
              path: 'categories',
              attributes: { taxonomy_id: taxonomy.get('id') },
            },
          },
        ])
      , []),
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
        ? options.concat({
          id: option.path, // filterOptionId
          label: option.label,
          message: option.message,
          path: option.connectPath,
          key: option.key,
          ownKey: option.ownKey,
          icon: option.path,
          active: !!activeEditOption && activeEditOption.optionId === option.path,
          create: { path: option.path },
        })
        : options
      , []),
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
        (typeof option.edit === 'undefined' || option.edit)
        && (typeof option.role === 'undefined' || hasUserRole[option.role])
        ? options.concat({
          id: option.attribute, // filterOptionId
          label: option.label,
          message: option.message,
          active: !!activeEditOption && activeEditOption.optionId === option.attribute,
        })
        : options
      , []),
    };
  }

  return editGroups;
};
