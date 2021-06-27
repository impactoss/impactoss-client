import { List } from 'immutable';
import { find, forEach } from 'lodash/collection';
import { upperFirst } from 'lodash/string';
import { lowerCase, startsWith } from 'utils/string';
import isNumber from 'utils/is-number';
import asArray from 'utils/as-array';
import asList from 'utils/as-list';

import appMessages from 'containers/App/messages';

import {
  getConnectedCategories,
  testEntityCategoryAssociation,
  getEntityTitle,
  getEntityReference,
  getEntityParentId,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';
import { makeTagFilterGroups } from 'utils/forms';

import {
  optionChecked,
  attributeOptionChecked,
} from './utils';

export const makeActiveFilterOptions = (
  entities,
  config,
  activeFilterOption,
  locationQuery,
  taxonomies,
  connections,
  connectedTaxonomies,
  messages,
  contextIntl,
  frameworks,
) => {
  // create filterOptions
  switch (activeFilterOption.group) {
    case 'taxonomies':
      return makeTaxonomyFilterOptions(
        entities,
        config.taxonomies,
        taxonomies,
        activeFilterOption.optionId,
        locationQuery,
        messages,
        contextIntl,
      );
    case 'frameworks':
      return makeFrameworkFilterOptions(
        entities,
        config.frameworks,
        frameworks,
        activeFilterOption.optionId,
        locationQuery,
      );
    case 'connectedTaxonomies':
      return makeConnectedTaxonomyFilterOptions(
        entities,
        config,
        connectedTaxonomies,
        activeFilterOption.optionId,
        locationQuery,
        messages,
        contextIntl,
      );
    case 'connections':
      return makeConnectionFilterOptions(
        entities,
        config.connections,
        connections,
        connectedTaxonomies,
        activeFilterOption.optionId,
        locationQuery,
        messages,
        contextIntl,
      );
    case 'attributes':
      return makeAttributeFilterOptions(
        entities,
        config.attributes,
        activeFilterOption.optionId,
        locationQuery.get('where'),
        messages,
      );
    default:
      return null;
  }
};

export const makeAttributeFilterOptions = (entities, config, activeOptionId, locationQueryValue, messages) => {
  const filterOptions = {
    groupId: 'attributes',
    options: {},
    multiple: true,
    required: false,
    search: true,
    selectAll: false,
  };
  // the attribute option
  const option = find(config.options, (o) => o.attribute === activeOptionId);
  if (option) {
    filterOptions.messagePrefix = messages.titlePrefix;
    filterOptions.message = option.message;
    filterOptions.search = option.search;
    if (entities.size === 0) {
      if (locationQueryValue && option.options) {
        asList(locationQueryValue).forEach((queryValue) => {
          if (attributeOptionChecked(queryValue, option.attribute)) {
            const locationQueryValueAttribute = queryValue.split(':');
            if (locationQueryValueAttribute.length > 1) {
              const locationAttribute = locationQueryValueAttribute[1];
              forEach(option.options, (attributeOption) => {
                if (attributeOption.value.toString() === locationAttribute) {
                  filterOptions.options[attributeOption.value] = {
                    label: attributeOption.label ? attributeOption.label : upperFirst(attributeOption.value),
                    message: attributeOption.message,
                    showCount: true,
                    value: `${option.attribute}:${attributeOption.value}`,
                    count: 0,
                    query: 'where',
                    checked: true,
                  };
                }
              });
            }
          }
        });
      }
    } else {
      entities.forEach((entity) => {
        if (typeof entity.getIn(['attributes', option.attribute]) !== 'undefined'
        && entity.getIn(['attributes', option.attribute]) !== null) {
          const value = entity.getIn(['attributes', option.attribute]).toString();
          const queryValue = `${option.attribute}:${value}`;
          // add connected entities if not present otherwise increase count
          if (filterOptions.options[value]) {
            filterOptions.options[value].count += 1;
          } else if (option.reference && !!entity.get(option.reference.key)) {
            filterOptions.options[value] = {
              label: entity.getIn([option.reference.key, 'attributes', option.reference.label]),
              showCount: true,
              value: queryValue,
              count: 1,
              query: 'where',
              checked: optionChecked(locationQueryValue, queryValue),
            };
          } else if (option.options) {
            const attributeOption = find(option.options, (o) => o.value.toString() === value);
            const label = attributeOption ? attributeOption.label : upperFirst(value);
            filterOptions.options[value] = {
              label,
              message: attributeOption.message,
              showCount: true,
              value: queryValue,
              count: 1,
              query: 'where',
              checked: optionChecked(locationQueryValue, queryValue),
            };
          }
        } else if (option.reference && option.reference.without) {
          if (filterOptions.options.without) {
            // no connection present
            // add without option
            filterOptions.options.without.count += 1;
          } else {
            const queryValue = `${option.attribute}:null`;
            filterOptions.options.without = {
              messagePrefix: messages.without,
              message: option.message,
              showCount: true,
              labelBold: true,
              value: queryValue,
              count: 1,
              query: 'where',
              checked: optionChecked(locationQueryValue, queryValue),
            };
          }
        }
      }); // for each entities
    } // if (entities.length === 0) {
  } // if option
  return filterOptions;
};

//
//
//
const getTaxTitle = (id, contextIntl) => contextIntl.formatMessage(appMessages.entities.taxonomies[id].single);

export const makeFrameworkFilterOptions = (
  entities,
  config,
  frameworks,
  activeTaxId,
  locationQuery,
) => {
  const filterOptions = {
    groupId: 'frameworks',
    search: false,
    options: {},
    multiple: false,
    required: false,
    selectAll: false,
    groups: null,
  };
  if (frameworks) {
    if (entities.size === 0) {
      if (locationQuery.get(config.query)) {
        const locationQueryValue = locationQuery.get(config.query);
        forEach(asArray(locationQueryValue), (queryValue) => {
          const value = parseInt(queryValue, 10);
          const framework = frameworks.get(value);
          if (framework) {
            filterOptions.options[value] = {
              label: getEntityTitle(framework),
              showCount: true,
              value,
              count: 0,
              query: config.query,
              checked: true,
            };
          }
        });
      }
    } else {
      entities.forEach((entity) => {
        const fwIds = [];
        // if entity has categories
        if (entity.getIn(['attributes', 'framework_id'])) {
          // add categories from entities if not present otherwise increase count
          frameworks.forEach((framework, fwId) => {
            // if entity has category of active taxonomy
            if (qe(entity.getIn(['attributes', 'framework_id']), fwId)) {
              fwIds.push(fwId);
              // if category already added
              if (filterOptions.options[fwId]) {
                filterOptions.options[fwId].count += 1;
              } else {
                filterOptions.options[fwId] = {
                  label: getEntityTitle(framework),
                  showCount: true,
                  value: fwId,
                  count: 1,
                  query: config.query,
                  checked: optionChecked(locationQuery.get(config.query), fwId),
                };
              }
            }
          });
        }
      }); // for each entities
    }
  }
  return filterOptions;
};

export const makeTaxonomyFilterOptions = (
  entities,
  config,
  taxonomies,
  activeTaxId,
  locationQuery,
  messages,
  contextIntl,
) => {
  const filterOptions = {
    groupId: 'taxonomies',
    search: config.search,
    options: {},
    multiple: true,
    required: false,
    selectAll: false,
    groups: null,
  };
  // get the active taxonomy
  const taxonomy = taxonomies.get(activeTaxId);
  if (taxonomy && taxonomy.get('categories')) {
    const parentId = getEntityParentId(taxonomy);
    const parent = parentId && taxonomies.get(parentId);
    if (parent) {
      filterOptions.groups = parent.get('categories').map((cat) => getEntityTitle(cat));
    }
    filterOptions.title = `${messages.titlePrefix} ${lowerCase(getTaxTitle(parseInt(taxonomy.get('id'), 10), contextIntl))}`;
    if (entities.size === 0) {
      if (locationQuery.get(config.query)) {
        const locationQueryValue = locationQuery.get(config.query);
        forEach(asArray(locationQueryValue), (queryValue) => {
          const value = parseInt(queryValue, 10);
          const category = taxonomy.getIn(['categories', value]);
          if (category) {
            filterOptions.options[value] = {
              reference: getEntityReference(category, false),
              label: getEntityTitle(category),
              group: parent && getEntityParentId(category),
              showCount: true,
              value,
              count: 0,
              query: config.query,
              checked: true,
              draft: category && category.getIn(['attributes', 'draft']),
            };
          }
        });
      }
      // check for checked without options
      if (locationQuery.get('without')) {
        const locationQueryValue = locationQuery.get('without');
        asList(locationQueryValue).forEach((queryValue) => {
          // numeric means taxonomy
          if (isNumber(queryValue) && taxonomy.get('id') === queryValue) {
            const value = parseInt(queryValue, 10);
            filterOptions.options[value] = {
              label: `${messages.without} ${lowerCase(getTaxTitle(parseInt(taxonomy.get('id'), 10), contextIntl))}`,
              showCount: true,
              labelBold: true,
              value,
              count: 0,
              query: 'without',
              checked: true,
            };
          }
        });
      }
    } else {
      entities.forEach((entity) => {
        const taxCategoryIds = [];
        // if entity has categories
        if (entity.get('categories')) {
          // add categories from entities if not present otherwise increase count
          taxonomy.get('categories').forEach((category, catId) => {
            // if entity has category of active taxonomy
            if (testEntityCategoryAssociation(entity, catId)) {
              taxCategoryIds.push(catId);
              // if category already added
              if (filterOptions.options[catId]) {
                filterOptions.options[catId].count += 1;
              } else {
                filterOptions.options[catId] = {
                  reference: getEntityReference(category, false),
                  label: getEntityTitle(category),
                  group: parent && getEntityParentId(category),
                  showCount: true,
                  value: catId,
                  count: 1,
                  query: config.query,
                  checked: optionChecked(locationQuery.get(config.query), catId),
                  draft: category && category.getIn(['attributes', 'draft']),
                };
              }
            }
          });
        }
        if (taxCategoryIds.length === 0) {
          if (filterOptions.options.without) {
            filterOptions.options.without.count += 1;
          } else {
            filterOptions.options.without = {
              label: `${messages.without} ${lowerCase(getTaxTitle(parseInt(taxonomy.get('id'), 10), contextIntl))}`,
              showCount: true,
              labelBold: true,
              value: taxonomy.get('id'),
              count: 1,
              query: 'without',
              checked: optionChecked(locationQuery.get('without'), taxonomy.get('id')),
            };
          }
        }
      }); // for each entities
    }
  }
  return filterOptions;
};

//
//
//
export const makeConnectionFilterOptions = (
  entities,
  config,
  connections,
  connectedTaxonomies,
  activeOptionId,
  locationQuery,
  messages,
  contextIntl,
) => {
  const filterOptions = {
    groupId: 'connections',
    options: {},
    multiple: true,
    required: false,
    search: true,
    advanced: true,
    selectAll: false,
  };

  // get the active option
  const option = find(
    config.options,
    (o) => o.groupByFramework
      ? startsWith(activeOptionId, o.path)
      : o.path === activeOptionId,
  );
  // if option active
  if (option) {
    const fwid = option.groupByFramework
      && activeOptionId.indexOf('_') > -1
      && parseInt(activeOptionId.split('_')[1], 10);
    // the option path
    const path = activeOptionId;
    filterOptions.messagePrefix = messages.titlePrefix;
    filterOptions.message = (fwid && option.message && option.message.indexOf('{fwid}') > -1)
      ? option.message.replace('{fwid}', fwid)
      : option.message;
    filterOptions.search = option.search;
    const { query } = config;
    let locationQueryValue = locationQuery.get(query);
    // if no entities found show any active options
    if (entities.size === 0) {
      if (locationQueryValue) {
        asList(locationQueryValue).forEach((queryValue) => {
          const locationQueryValueConnection = queryValue.split(':');
          if (locationQueryValueConnection.length > 1) {
            if (path === locationQueryValueConnection[0]) {
              const value = locationQueryValueConnection[1];
              const connection = connections.get(option.path) && connections.getIn([option.path, value]);
              filterOptions.options[value] = {
                reference: connection ? getEntityReference(connection) : '',
                label: connection ? getEntityTitle(connection, option.labels, contextIntl) : upperFirst(value),
                showCount: true,
                value: `${path}:${value}`,
                count: 0,
                query,
                checked: true,
                tags: connection ? connection.get('categories') : null,
                draft: connection && connection.getIn(['attributes', 'draft']),
              };
            }
          }
        });
      }
      // also check for active without options
      if (locationQuery.get('without')) {
        locationQueryValue = locationQuery.get('without');
        asList(locationQueryValue).forEach((queryValue) => {
          if (path === queryValue) {
            filterOptions.options[queryValue] = {
              messagePrefix: messages.without,
              label: option.label,
              message: option.message,
              showCount: true,
              labelBold: true,
              value: queryValue,
              count: 0,
              query: 'without',
              checked: true,
            };
          }
        });
      }
    } else {
      entities.forEach((entity) => {
        let optionConnections = List();
        const entityConnections = option.groupByFramework
          ? entity.getIn([`${option.path}ByFw`, fwid])
          : entity.get(option.path);
        // if entity has connected entities
        if (entityConnections) {
          // add connected entities if not present otherwise increase count
          entityConnections.forEach((connectedId) => {
            const connection = connections.getIn([option.path, connectedId.toString()]);
            // if not taxonomy already considered
            if (connection) {
              optionConnections = optionConnections.push(connection);
              // if category already added
              if (filterOptions.options[connectedId]) {
                filterOptions.options[connectedId].count += 1;
              } else {
                const value = `${path}:${connectedId}`;
                const reference = getEntityReference(connection);
                const label = getEntityTitle(connection, option.labels, contextIntl);
                filterOptions.options[connectedId] = {
                  label,
                  reference,
                  showCount: true,
                  value: `${path}:${connectedId}`,
                  count: 1,
                  query,
                  checked: optionChecked(locationQueryValue, value),
                  tags: connection.get('categories'),
                  draft: connection.getIn(['attributes', 'draft']),
                };
              }
            }
          });
        }
        if (optionConnections.size === 0) {
          if (filterOptions.options.without) {
            // no connection present
            // add without option
            filterOptions.options.without.count += 1;
          } else {
            filterOptions.options.without = {
              messagePrefix: messages.without,
              label: option.label,
              message: (
                option.groupByFramework
                && option.message
                && option.message.indexOf('{fwid}') > -1
              )
                ? option.message.replace('{fwid}', fwid)
                : option.message,
              showCount: true,
              labelBold: true,
              value: path,
              count: 1,
              query: 'without',
              checked: optionChecked(locationQuery.get('without'), path),
            };
          }
        }
      }); // for each entities
    }
  }
  filterOptions.tagFilterGroups = option && makeTagFilterGroups(connectedTaxonomies, contextIntl);
  return filterOptions;
};


export const makeConnectedTaxonomyFilterOptions = (
  entities,
  config,
  connectedTaxonomies,
  activeOptionId,
  locationQuery,
  messages,
  contextIntl,
) => {
  const filterOptions = {
    groupId: 'connectedTaxonomies',
    search: config.connectedTaxonomies.search,
    options: {},
    multiple: true,
    required: false,
    selectAll: false,
    groups: null,
  };

  const taxonomy = connectedTaxonomies.get(activeOptionId);
  if (taxonomy) {
    // figure out parent taxonomy for nested grouping
    const parentId = getEntityParentId(taxonomy);
    const parent = parentId && connectedTaxonomies.get(parentId);
    if (parent) {
      filterOptions.groups = parent.get('categories').map((cat) => getEntityTitle(cat));
    }
    filterOptions.title = `${messages.titlePrefix} ${lowerCase(getTaxTitle(parseInt(taxonomy.get('id'), 10), contextIntl))}`;
    const { query } = config.connectedTaxonomies;
    const locationQueryValue = locationQuery.get(query);
    if (entities.size === 0) {
      if (locationQueryValue) {
        asList(locationQueryValue).forEach((queryValue) => {
          const locationQueryValueCategory = queryValue.split(':');
          if (locationQueryValueCategory.length > 1) {
            // for each connection
            forEach(config.connectedTaxonomies.connections, (connection) => {
              if (connection.path === locationQueryValueCategory[0]) {
                const categoryId = parseInt(locationQueryValueCategory[1], 10);
                if (taxonomy.getIn(['categories', categoryId])) {
                  const category = taxonomy.getIn(['categories', categoryId]);
                  filterOptions.options[categoryId] = {
                    reference: getEntityReference(category, false),
                    label: getEntityTitle(category),
                    group: parent && getEntityParentId(category),
                    showCount: true,
                    value: `${connection.path}:${categoryId}`,
                    count: 0,
                    query,
                    checked: true,
                  };
                }
              }
            });
          }
        });
      }
    } else {
      entities.forEach((entity) => {
        forEach(config.connectedTaxonomies.connections, (connection) => {
          // connection eg recommendations
          // if entity has taxonomies
          if (entity.get(connection.path)) { // action.recommendations stores recommendation_measures
            // add categories from entities for taxonomy
            const categories = getConnectedCategories(
              entity.get(connection.path),
              taxonomy.get('categories'),
              connection.path,
            );
            categories.forEach((category) => {
              // if category already added
              if (filterOptions.options[category.get('id')]) {
                filterOptions.options[category.get('id')].count += 1;
              } else {
                const value = `${connection.path}:${category.get('id')}`;
                const label = getEntityTitle(category);
                filterOptions.options[category.get('id')] = {
                  reference: getEntityReference(category, false),
                  group: parent && getEntityParentId(category),
                  label,
                  showCount: true,
                  value,
                  count: 1,
                  query,
                  checked: optionChecked(locationQueryValue, value),
                };
              }
            });
          }
        });
      });
    }
  }
  return filterOptions;
};
