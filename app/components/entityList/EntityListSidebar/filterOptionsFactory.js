import { find, forEach } from 'lodash/collection';
import { upperFirst } from 'lodash/string';
import { lowerCase } from 'utils/string';
import isNumber from 'utils/is-number';
import asArray from 'utils/as-array';
import asList from 'utils/as-list';
import {
  getConnectedCategories,
  testEntityCategoryAssociation,
  getEntityTitle,
  getEntityReference,
} from 'utils/entities';
import {
  optionChecked,
  attributeOptionChecked,
} from './utils';

export const makeActiveFilterOptions = (entities, filters, activeFilterOption, locationQuery, taxonomies, connections, connectedTaxonomies, messages, formatLabel) => {
  // create filterOptions
  switch (activeFilterOption.group) {
    case 'taxonomies':
      return makeTaxonomyFilterOptions(entities, filters.taxonomies, taxonomies.get(activeFilterOption.optionId), locationQuery, messages);
    case 'connectedTaxonomies':
      return makeConnectedTaxonomyFilterOptions(entities, filters, connectedTaxonomies, activeFilterOption.optionId, locationQuery, messages, formatLabel);
    case 'connections':
      return makeConnectionFilterOptions(entities, filters.connections, connections, activeFilterOption.optionId, locationQuery, messages, formatLabel);
    case 'attributes':
      return makeAttributeFilterOptions(entities, filters.attributes, activeFilterOption.optionId, locationQuery.get('where'), messages, formatLabel);
    default:
      return null;
  }
};

export const makeAttributeFilterOptions = (entities, filters, activeOptionId, locationQueryValue, messages, formatLabel) => {
  const filterOptions = {
    groupId: 'attributes',
    options: {},
    multiple: true,
    required: false,
    search: true,
  };
  // the attribute option
  const option = find(filters.options, (o) => o.attribute === activeOptionId);
  if (option) {
    filterOptions.title = `${messages.titlePrefix} ${lowerCase(formatLabel(option.label))}`;
    filterOptions.search = option.search;
    if (entities.size === 0) {
      if (locationQueryValue && option.options) {
        asList(locationQueryValue).forEach((queryValue) => {
          if (attributeOptionChecked(queryValue, option.attribute)) {
            const locationQueryValueAttribute = queryValue.split(':');
            if (locationQueryValueAttribute.length > 1) {
              const locationAttribute = locationQueryValueAttribute[1];
              forEach(option.options, (attribute) => {
                if (attribute.value.toString() === locationAttribute) {
                  filterOptions.options[attribute.value] = {
                    label: attribute.label ? attribute.label : upperFirst(attribute.value),
                    showCount: true,
                    value: `${option.attribute}:${attribute.value}`,
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
        if (typeof entity.getIn(['attributes', option.attribute]) !== 'undefined' && entity.getIn(['attributes', option.attribute]) !== null) {
          const value = entity.getIn(['attributes', option.attribute]).toString();
          const queryValue = `${option.attribute}:${value}`;
          // add connected entities if not present otherwise increase count
          if (filterOptions.options[value]) {
            filterOptions.options[value].count += 1;
          } else if (option.extension && !!entity.get(option.extension.key)) {
            const extension = entity.getIn([option.extension.key, '0']);
            filterOptions.options[value] = {
              label: extension ? extension.getIn(['attributes', option.extension.label]) : upperFirst(value),
              showCount: true,
              value: queryValue,
              count: 1,
              query: 'where',
              checked: optionChecked(locationQueryValue, queryValue),
            };
          } else if (option.options) {
            const attribute = find(option.options, (o) => o.value.toString() === value);
            const label = attribute ? attribute.label : upperFirst(value);
            filterOptions.options[value] = {
              label,
              showCount: true,
              value: queryValue,
              count: 1,
              query: 'where',
              checked: optionChecked(locationQueryValue, queryValue),
            };
          }
        } else if (option.extension && option.extension.without) {
          if (filterOptions.options.without) {
            // no connection present
            // add without option
            filterOptions.options.without.count += 1;
          } else {
            const queryValue = `${option.attribute}:null`;
            filterOptions.options.without = {
              label: `${messages.without} ${lowerCase(formatLabel(option.label))}`,
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
export const makeTaxonomyFilterOptions = (entities, filters, taxonomy, locationQuery, messages) => {
  const filterOptions = {
    groupId: 'taxonomies',
    search: filters.search,
    options: {},
    multiple: true,
    required: false,
  };
  // get the active taxonomy

  if (taxonomy && taxonomy.get('categories')) {
    filterOptions.title = `${messages.titlePrefix} ${lowerCase(taxonomy.getIn(['attributes', 'title']))}`;
    if (entities.size === 0) {
      if (locationQuery.get(filters.query)) {
        const locationQueryValue = locationQuery.get(filters.query);
        forEach(asArray(locationQueryValue), (queryValue) => {
          const value = parseInt(queryValue, 10);
          if (taxonomy.getIn(['categories', value])) {
            filterOptions.options[value] = {
              reference: getEntityReference(taxonomy.getIn(['categories', value]), false),
              label: getEntityTitle(taxonomy.getIn(['categories', value])),
              showCount: true,
              value,
              count: 0,
              query: filters.query,
              checked: true,
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
              label: `${messages.without} ${lowerCase(taxonomy.getIn(['attributes', 'title']))}`,
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
                const label = getEntityTitle(category);
                filterOptions.options[catId] = {
                  reference: getEntityReference(category, false),
                  label,
                  showCount: true,
                  value: catId,
                  count: 1,
                  query: filters.query,
                  checked: optionChecked(locationQuery.get(filters.query), catId),
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
              label: `${messages.without} ${lowerCase(taxonomy.getIn(['attributes', 'title']))}`,
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
export const makeConnectionFilterOptions = (entities, connectionFilters, connections, activeOptionId, locationQuery, messages, formatLabel) => {
  const filterOptions = {
    groupId: 'connections',
    options: {},
    multiple: true,
    required: false,
    search: true,
    advanced: true,
  };
  // get the active option
  const option = find(connectionFilters.options, (o) => o.path === activeOptionId);
  // if option active
  if (option) {
    filterOptions.title = `${messages.titlePrefix} ${lowerCase(formatLabel(option.label))}`;
    filterOptions.search = option.search;
    const query = connectionFilters.query;
    let locationQueryValue = locationQuery.get(query);
    // if no entities found show any active options
    if (entities.size === 0) {
      if (locationQueryValue) {
        asList(locationQueryValue).forEach((queryValue) => {
          const locationQueryValueConnection = queryValue.split(':');
          if (locationQueryValueConnection.length > 1) {
            if (option.path === locationQueryValueConnection[0]) {
              const value = parseInt(locationQueryValueConnection[1], 10);
              filterOptions.options[value] = {
                reference: connections.get(option.path) && connections.getIn([option.path, value])
                    ? getEntityReference(connections.getIn([option.path, value]))
                    : '',
                label: connections.get(option.path) && connections.getIn([option.path, value])
                    ? getEntityTitle(connections.getIn([option.path, value]))
                    : upperFirst(value),
                showCount: true,
                value: `${option.path}:${value}`,
                count: 0,
                query,
                checked: true,
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
              label: `${messages.without} ${lowerCase(formatLabel(option.label))}`,
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
        const optionConnectedIds = [];
        // if entity has connected entities
        if (entity.get(option.path)) {
          // add connected entities if not present otherwise increase count
          entity.get(option.path).forEach((connectedId) => {
            const connection = connections.getIn([option.path, connectedId.toString()]);
            // if not taxonomy already considered
            if (connection) {
              optionConnectedIds.push(connectedId);
              // if category already added
              if (filterOptions.options[connectedId]) {
                filterOptions.options[connectedId].count += 1;
              } else {
                const value = `${option.path}:${connectedId}`;
                const reference = getEntityReference(connection);
                const label = getEntityTitle(connection);
                filterOptions.options[connectedId] = {
                  label,
                  reference,
                  showCount: true,
                  value: `${option.path}:${connectedId}`,
                  count: 1,
                  query,
                  checked: optionChecked(locationQueryValue, value),
                };
              }
            }
          });
        }
        if (optionConnectedIds.length === 0) {
          if (filterOptions.options.without) {
            // no connection present
            // add without option
            filterOptions.options.without.count += 1;
          } else {
            filterOptions.options.without = {
              label: `${messages.without} ${lowerCase(formatLabel(option.label))}`,
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
  return filterOptions;
};


export const makeConnectedTaxonomyFilterOptions = (entities, filters, connectedTaxonomies, activeOptionId, locationQuery, messages) => {
  const filterOptions = {
    groupId: 'connectedTaxonomies',
    search: filters.connectedTaxonomies.search,
    options: {},
    multiple: true,
    required: false,
  };

  const taxonomy = connectedTaxonomies.get(activeOptionId);
  if (taxonomy) {
    filterOptions.title = `${messages.titlePrefix} ${lowerCase(taxonomy.getIn(['attributes', 'title']))}`;
    const query = filters.connectedTaxonomies.query;
    const locationQueryValue = locationQuery.get(query);
    if (entities.size === 0) {
      if (locationQueryValue) {
        asList(locationQueryValue).forEach((queryValue) => {
          const locationQueryValueCategory = queryValue.split(':');
          if (locationQueryValueCategory.length > 1) {
            forEach(filters.connectedTaxonomies.connections, (connection) => {
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
        forEach(filters.connectedTaxonomies.connections, (connection) => {
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
