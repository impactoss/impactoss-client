import { reduce } from 'lodash/collection';

// figure out filter groups for filter panel
export const makeFilterGroups = (
  config,
  taxonomies,
  connectedTaxonomies,
  activeFilterOption,
  canFilterDraft,
  messages,
  formatLabel
) => {
  const filterGroups = {};

  // taxonomy option group
  if (config.taxonomies && taxonomies) {
    // first prepare taxonomy options
    filterGroups.taxonomies = {
      id: 'taxonomies', // filterGroupId
      label: messages.taxonomies,
      show: true,
      icon: 'categories',
      options: taxonomies.reduce((taxOptions, taxonomy) => ({
        ...taxOptions,
        [taxonomy.get('id')]: {
          id: taxonomy.get('id'), // filterOptionId
          label: taxonomy.getIn(['attributes', 'title']),
          active: !!activeFilterOption && activeFilterOption.optionId === taxonomy.get('id'),
        },
      }), {}),
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
      options: connectedTaxonomies.reduce((taxOptions, taxonomy) =>
        config.connectedTaxonomies.exclude && taxonomy.getIn(['attributes', config.connectedTaxonomies.exclude])
          ? taxOptions
          : ({
            ...taxOptions,
            [taxonomy.get('id')]: {
              id: taxonomy.get('id'), // filterOptionId
              label: taxonomy.getIn(['attributes', 'title']),
              active: !!activeFilterOption && activeFilterOption.optionId === taxonomy.get('id'),
            },
          })
      , {}),
    };
  }

  // connections option group
  if (config.connections) {
    // first prepare taxonomy options
    filterGroups.connections = {
      id: 'connections', // filterGroupId
      label: messages.connections,
      show: true,
      options: reduce(config.connections.options, (options, option) => ({
        ...options,
        [option.path]: {
          id: option.path, // filterOptionId
          label: formatLabel(option.label),
          icon: option.path,
          active: !!activeFilterOption && activeFilterOption.optionId === option.path,
        },
      }), {}),
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
        option.attribute !== 'draft' || (option.attribute === 'draft' && canFilterDraft)
          ? {
            ...options,
            [option.attribute]: {
              id: option.attribute, // filterOptionId
              label: formatLabel(option.label),
              active: !!activeFilterOption && activeFilterOption.optionId === option.attribute,
            },
          }
          : options
      , {}),
    };
  }

  return filterGroups;
};
