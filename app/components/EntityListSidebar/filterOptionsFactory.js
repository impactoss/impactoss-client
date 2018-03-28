import { List } from 'immutable';
import { find, forEach } from 'lodash/collection';
import { upperFirst } from 'lodash/string';
import { lowerCase } from 'utils/string';
import isNumber from 'utils/is-number';
import asArray from 'utils/as-array';
import asList from 'utils/as-list';

import appMessages from 'containers/App/messages';

import {
  getConnectedCategories,
  testEntityCategoryAssociation,
  getEntityTitle,
  getEntityReference,
} from 'utils/entities';

import { makeTagFilterGroups } from 'utils/forms';

import {
  optionChecked,
  attributeOptionChecked,
} from './utils';

export const makeActiveFilterOptions = (entities, config, activeFilterOption, locationQuery, taxonomies, connections, connectedTaxonomies, messages, contextIntl) => {
  // create filterOptions
  switch (activeFilterOption.group) {
    case 'taxonomies':
      return makeTaxonomyFilterOptions(entities, config.taxonomies, taxonomies.get(activeFilterOption.optionId), locationQuery, messages, contextIntl);
    case 'connectedTaxonomies':
      return makeConnectedTaxonomyFilterOptions(entities, config, connectedTaxonomies, activeFilterOption.optionId, locationQuery, messages, contextIntl);
    case 'connections':
      return makeConnectionFilterOptions(entities, config.connections, connections, connectedTaxonomies, activeFilterOption.optionId, locationQuery, messages, contextIntl);
    case 'attributes':
      return makeAttributeFilterOptions(entities, config.attributes, activeFilterOption.optionId, locationQuery.get('where'), messages);
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
      });  // for each entities
    } // if (entities.length === 0) {
  } // if option
  return filterOptions;
};

//
//
//
const getTaxTitle = (id, contextIntl) => contextIntl.formatMessage(appMessages.entities.taxonomies[id].single);

export const makeTaxonomyFilterOptions = (entities, config, taxonomy, locationQuery, messages, contextIntl) => {
  const filterOptions = {
    groupId: 'taxonomies',
    search: config.search,
    options: {},
    multiple: true,
    required: false,
    selectAll: false,
  };
  // get the active taxonomy

  if (taxonomy && taxonomy.get('categories')) {
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
      });  // for each entities
    }
  }
  return filterOptions;
};

//
//
//
export const makeConnectionFilterOptions = (entities, config, connections, connectedTaxonomies, activeOptionId, locationQuery, messages, contextIntl) => {
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
  const option = find(config.options, (o) => o.path === activeOptionId);
  // if option active
  if (option) {
    filterOptions.messagePrefix = messages.titlePrefix;
    filterOptions.message = option.message;
    filterOptions.search = option.search;
    const query = config.query;
    let locationQueryValue = locationQuery.get(query);
    // if no entities found show any active options
    if (entities.size === 0) {
      if (locationQueryValue) {
        asList(locationQueryValue).forEach((queryValue) => {
          const locationQueryValueConnection = queryValue.split(':');
          if (locationQueryValueConnection.length > 1) {
            if (option.path === locationQueryValueConnection[0]) {
              const value = parseInt(locationQueryValueConnection[1], 10);
              const connection = connections.get(option.path) && connections.getIn([option.path, value]);
              filterOptions.options[value] = {
                reference: connection ? getEntityReference(connection) : '',
                label: connection ? getEntityTitle(connection, option.labels, contextIntl) : upperFirst(value),
                showCount: true,
                value: `${option.path}:${value}`,
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
          if (option.path === queryValue) {
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
        // if entity has connected entities
        if (entity.get(option.path)) {
          // add connected entities if not present otherwise increase count
          entity.get(option.path).forEach((connectedId) => {
            const connection = connections.getIn([option.path, connectedId.toString()]);
            // if not taxonomy already considered
            if (connection) {
              optionConnections = optionConnections.push(connection);
              // if category already added
              if (filterOptions.options[connectedId]) {
                filterOptions.options[connectedId].count += 1;
              } else {
                const value = `${option.path}:${connectedId}`;
                const reference = getEntityReference(connection);
                const label = getEntityTitle(connection, option.labels, contextIntl);
                filterOptions.options[connectedId] = {
                  label,
                  reference,
                  showCount: true,
                  value: `${option.path}:${connectedId}`,
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
              message: option.message,
              showCount: true,
              labelBold: true,
              value: option.path,
              count: 1,
              query: 'without',
              checked: optionChecked(locationQuery.get('without'), option.path),
            };
          }
        }
      });  // for each entities
    }
  }
  filterOptions.tagFilterGroups = option && makeTagFilterGroups(connectedTaxonomies, contextIntl);
  return filterOptions;
};


export const makeConnectedTaxonomyFilterOptions = (entities, config, connectedTaxonomies, activeOptionId, locationQuery, messages, contextIntl) => {
  const filterOptions = {
    groupId: 'connectedTaxonomies',
    search: config.connectedTaxonomies.search,
    options: {},
    multiple: true,
    required: false,
    selectAll: false,
  };

  const taxonomy = connectedTaxonomies.get(activeOptionId);
  if (taxonomy) {
    filterOptions.title = `${messages.titlePrefix} ${lowerCase(getTaxTitle(parseInt(taxonomy.get('id'), 10), contextIntl))}`;
    const query = config.connectedTaxonomies.query;
    const locationQueryValue = locationQuery.get(query);
    if (entities.size === 0) {
      if (locationQueryValue) {
        asList(locationQueryValue).forEach((queryValue) => {
          const locationQueryValueCategory = queryValue.split(':');
          if (locationQueryValueCategory.length > 1) {
            forEach(config.connectedTaxonomies.connections, (connection) => {
              if (connection.path === locationQueryValueCategory[0]) {
                const categoryId = parseInt(locationQueryValueCategory[1], 10);
                if (taxonomy.getIn(['categories', categoryId])) {
                  const category = taxonomy.getIn(['categories', categoryId]);
                  filterOptions.options[categoryId] = {
                    reference: getEntityReference(category, false),
                    label: getEntityTitle(category),
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
