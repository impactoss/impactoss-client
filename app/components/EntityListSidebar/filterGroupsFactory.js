import { reduce } from 'lodash/collection';
import { sortEntities } from 'utils/sort';

// figure out filter groups for filter panel
export const makeFilterGroups = (
  config,
  taxonomies,
  connectedTaxonomies,
  activeFilterOption,
  hasUserRole,
  messages,
) => {
  const filterGroups = {};

  // taxonomy option group
  if (config.taxonomies && taxonomies) {
    // first prepare taxonomy options
    filterGroups.taxonomies = {
      id: 'taxonomies', // filterGroupId
      label: messages.taxonomyGroup,
      show: true,
      icon: 'categories',
      options: sortEntities(taxonomies, 'asc', 'priority').reduce((memo, taxonomy) =>
        memo.concat([
          {
            id: taxonomy.get('id'), // filterOptionId
            label: messages.taxonomies(taxonomy.get('id')),
            active: !!activeFilterOption && activeFilterOption.optionId === taxonomy.get('id'),
          },
        ])
      , []),
    };
  }

  // connectedTaxonomies option group
  if (config.connectedTaxonomies) {
    // first prepare taxonomy options
    filterGroups.connectedTaxonomies = {
      id: 'connectedTaxonomies', // filterGroupId
      label: messages.connectedTaxonomies,
      show: true,
      icon: 'connectedCategories',
      options: sortEntities(connectedTaxonomies, 'asc', 'priority').reduce((taxOptions, taxonomy) =>
        config.connectedTaxonomies.exclude && taxonomy.getIn(['attributes', config.connectedTaxonomies.exclude])
          ? taxOptions
          : taxOptions.concat([
            {
              id: taxonomy.get('id'), // filterOptionId
              label: messages.taxonomies(taxonomy.get('id')),
              active: !!activeFilterOption && activeFilterOption.optionId === taxonomy.get('id'),
            },
          ])
      , []),
    };
  }

  // connections option group
  if (config.connections) {
    // first prepare taxonomy options
    filterGroups.connections = {
      id: 'connections', // filterGroupId
      label: messages.connections,
      show: true,
      options: reduce(config.connections.options, (options, option) =>
        options.concat({
          id: option.path, // filterOptionId
          label: option.label,
          message: option.message,
          icon: option.path,
          active: !!activeFilterOption && activeFilterOption.optionId === option.path,
        })
      , []),
    };
  }

  // attributes
  if (config.attributes) {
    // first prepare taxonomy options
    filterGroups.attributes = {
      id: 'attributes', // filterGroupId
      label: messages.attributes,
      show: true,
      options: reduce(config.attributes.options, (options, option) =>
        (typeof option.role === 'undefined' || hasUserRole[option.role])
          ? options.concat([{
            id: option.attribute, // filterOptionId
            label: option.label,
            message: option.message,
            active: !!activeFilterOption && activeFilterOption.optionId === option.attribute,
          }])
          : options
      , []),
    };
  }

  return filterGroups;
};
