import { find, forEach, map } from 'lodash/collection';
import { upperFirst } from 'lodash/string';
import { lowerCase } from 'utils/string';
import isNumber from 'utils/is-number';
import asArray from 'utils/as-array';
import { getConnectedCategoryIds } from 'utils/entities';
import { optionChecked, attributeOptionChecked } from './utils';


export const makeActiveFilterOptions = (entities, filters, activeFilterOption, location, taxonomies, connections, connectedTaxonomies, messages) => {
  // create filterOptions
  switch (activeFilterOption.group) {
    case 'taxonomies':
      return makeTaxonomyFilterOptions(entities, filters, taxonomies, activeFilterOption, location, messages);
    case 'connectedTaxonomies':
      return makeConnectedTaxonomyFilterOptions(entities, filters, connectedTaxonomies, activeFilterOption, location, messages);
    case 'connections':
      return makeConnectionFilterOptions(entities, filters, connections, activeFilterOption, location, messages);
    case 'attributes':
      return makeAttributeFilterOptions(entities, filters, activeFilterOption, location, messages);
    default:
      return null;
  }
};

export const makeAttributeFilterOptions = (entities, filters, activeFilterOption, location, messages) => {
  const locationQuery = location.query;

  const filterOptions = {
    groupId: 'attributes',
    options: {},
    multiple: true,
    required: false,
    filter: true,
  };
  // the attribute option
  const option = find(filters.attributes.options, (o) => o.attribute === activeFilterOption.optionId);
  if (option) {
    filterOptions.title = `${messages.titlePrefix} ${lowerCase(option.label)}`;
    filterOptions.filter = option.filter;
    const locationQueryValue = locationQuery.where;
    if (entities.length === 0) {
      if (locationQueryValue && option.options) {
        forEach(asArray(locationQueryValue), (queryValue) => {
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
      forEach(Object.values(entities), (entity) => {
        if (typeof entity.attributes[option.attribute] !== 'undefined' && entity.attributes[option.attribute] !== null) {
          const value = entity.attributes[option.attribute].toString();
          const queryValue = `${option.attribute}:${value}`;
          // add connected entities if not present otherwise increase count
          if (filterOptions.options[value]) {
            filterOptions.options[value].count += 1;
          } else if (option.extension && !!entity[option.extension.key]) {
            const extension = Object.values(entity[option.extension.key])[0];
            filterOptions.options[value] = {
              label: extension ? extension.attributes[option.extension.label] : upperFirst(value),
              showCount: true,
              value: queryValue,
              count: 1,
              query: 'where',
              checked: optionChecked(locationQueryValue, queryValue),
              order: extension ? extension.attributes[option.extension.label] : value,
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
              order: label,
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
              label: `${messages.without} ${lowerCase(option.label)}`,
              showCount: true,
              labelBold: true,
              value: queryValue,
              count: 1,
              query: 'where',
              checked: optionChecked(locationQueryValue, queryValue),
              order: 0,
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
export const makeTaxonomyFilterOptions = (entities, filters, taxonomies, activeFilterOption, location, messages) => {
  const locationQuery = location.query;

  const filterOptions = {
    groupId: 'taxonomies',
    filter: filters.taxonomies.filter,
    options: {},
    multiple: true,
    required: false,
  };
  // get the active taxonomy
  const taxonomy = taxonomies[parseInt(activeFilterOption.optionId, 10)];
  if (taxonomy && taxonomy.categories) {
    filterOptions.title = `${messages.titlePrefix} ${lowerCase(taxonomy.attributes.title)}`;
    if (entities.length === 0) {
      if (locationQuery[filters.taxonomies.query]) {
        const locationQueryValue = locationQuery[filters.taxonomies.query];
        forEach(asArray(locationQueryValue), (queryValue) => {
          const value = parseInt(queryValue, 10);
          if (taxonomy.categories[value]) {
            filterOptions.options[value] = {
              label: taxonomy.categories[value].attributes.title || taxonomy.categories[value].attributes.name,
              showCount: true,
              value,
              count: 0,
              query: filters.taxonomies.query,
              checked: true,
            };
          }
        });
      }
      // check for checked without options
      if (locationQuery.without) {
        const locationQueryValue = locationQuery.without;
        forEach(asArray(locationQueryValue), (queryValue) => {
          // numeric means taxonomy
          if (isNumber(queryValue) && taxonomy.id === queryValue) {
            const value = parseInt(queryValue, 10);
            filterOptions.options[value] = {
              label: `${messages.without} ${lowerCase(taxonomy.attributes.title)}`,
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
      forEach(Object.values(entities), (entity) => {
        const taxCategoryIds = [];
        // if entity has taxonomies
        if (entity.taxonomies) {
          // add categories from entities if not present otherwise increase count
          const categoryIds = map(map(Object.values(entity.taxonomies), 'attributes'), 'category_id');
          forEach(taxonomy.categories, (cat, catId) => {
            // if entity has category of active taxonomy
            if (categoryIds && categoryIds.indexOf(parseInt(catId, 10)) > -1) {
              taxCategoryIds.push(catId);
              // if category already added
              if (filterOptions.options[catId]) {
                filterOptions.options[catId].count += 1;
              } else {
                const label = cat.attributes.title || cat.attributes.name;
                filterOptions.options[catId] = {
                  label,
                  reference: null,
                  showCount: true,
                  value: catId,
                  count: 1,
                  query: filters.taxonomies.query,
                  checked: optionChecked(locationQuery[filters.taxonomies.query], catId),
                  order: label,
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
              label: `${messages.without} ${lowerCase(taxonomy.attributes.title)}`,
              showCount: true,
              labelBold: true,
              value: taxonomy.id,
              count: 1,
              query: 'without',
              checked: optionChecked(locationQuery.without, taxonomy.id),
              order: 0,
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
export const makeConnectionFilterOptions = (entities, filters, connections, activeFilterOption, location, messages) => {
  const locationQuery = location.query;

  const filterOptions = {
    groupId: 'connections',
    options: {},
    multiple: true,
    required: false,
    filter: true,
  };
  // get the active option
  const option = find(filters.connections.options, (o) => o.path === activeFilterOption.optionId);
  // if option active
  if (option) {
    filterOptions.title = `${messages.titlePrefix} ${lowerCase(option.label)}`;
    filterOptions.filter = option.filter;
    // if no entities found show any active options
    if (entities.length === 0) {
      if (locationQuery[option.query]) {
        const locationQueryValue = locationQuery[option.query];
        forEach(asArray(locationQueryValue), (queryValue) => {
          const value = parseInt(queryValue, 10);
          filterOptions.options[value] = {
            label: connections[option.path] && connections[option.path][value]
                ? connections[option.path][value].attributes.title
                : upperFirst(value),
            showCount: true,
            value,
            count: 0,
            query: option.query,
            checked: true,
          };
        });
      }
      // also check for active without options
      if (locationQuery.without) {
        const locationQueryValue = locationQuery.without;
        forEach(asArray(locationQueryValue), (queryValue) => {
          if (option.query === queryValue) {
            filterOptions.options[queryValue] = {
              label: `${messages.without} ${lowerCase(option.label)}`,
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
      forEach(Object.values(entities), (entity) => {
        const optionConnectedIds = [];
        // if entity has connected entities
        if (entity[option.path]) {
          // add connected entities if not present otherwise increase count
          const connectedIds = {
            [option.path]: map(map(Object.values(entity[option.path]), 'attributes'), option.key),
          };
          forEach(connectedIds[option.path], (connectedId) => {
            const connection = connections[option.path][connectedId];
            // if not taxonomy already considered
            if (connection) {
              optionConnectedIds.push(connectedId);
              // if category already added
              if (filterOptions.options[connectedId]) {
                filterOptions.options[connectedId].count += 1;
              } else {
                const reference = connection.attributes.number || connection.id;
                filterOptions.options[connectedId] = {
                  label: connection.attributes.title || connection.attributes.friendly_name || connection.attributes.name,
                  reference,
                  showCount: true,
                  value: connectedId,
                  count: 1,
                  query: option.query,
                  checked: optionChecked(locationQuery[option.query], connectedId),
                  order: reference,
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
              label: `${messages.without} ${lowerCase(option.label)}`,
              showCount: true,
              labelBold: true,
              value: option.query,
              count: 1,
              query: 'without',
              checked: optionChecked(locationQuery.without, option.query),
              order: 0,
            };
          }
        }
      });  // for each entities
    }
  }
  return filterOptions;
};


export const makeConnectedTaxonomyFilterOptions = (entities, filters, connectedTaxonomies, activeFilterOption, location, messages) => {
  const locationQuery = location.query;

  const filterOptions = {
    groupId: 'connectedTaxonomies',
    filter: filters.connectedTaxonomies.filter,
    options: {},
    multiple: true,
    required: false,
  };

  const taxonomy = connectedTaxonomies.taxonomies[parseInt(activeFilterOption.optionId, 10)];
  if (taxonomy) {
    filterOptions.title = `${messages.titlePrefix} ${lowerCase(taxonomy.attributes.title)}`;
    const query = filters.connectedTaxonomies.query;
    const locationQueryValue = locationQuery[query];
    if (entities.length === 0) {
      if (locationQueryValue) {
        forEach(asArray(locationQueryValue), (queryValue) => {
          const locationQueryValueCategory = queryValue.split(':');
          if (locationQueryValueCategory.length > 1) {
            forEach(filters.connectedTaxonomies.connections, (connection) => {
              if (connection.path === locationQueryValueCategory[0]) {
                const categoryId = parseInt(locationQueryValueCategory[1], 10);
                if (taxonomy.categories[categoryId]) {
                  const cat = taxonomy.categories[categoryId];
                  const label = cat.attributes.title || cat.attributes.name;

                  filterOptions.options[categoryId] = {
                    label,
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
      forEach(Object.values(entities), (entity) => {
        forEach(filters.connectedTaxonomies.connections, (connection) => {
          // connection eg recommendations
          // if entity has taxonomies
          if (entity[connection.path]) { // action.recommendations stores recommendation_measures
            // add categories from entities for taxonomy
            const categoryIds = getConnectedCategoryIds(
              entity,
              connection,
              taxonomy
            );
            forEach(categoryIds, (categoryId) => {
              // if category of current taxonomy
              if (taxonomy.categories[categoryId]) {
                // if category already added
                if (filterOptions.options[categoryId]) {
                  filterOptions.options[categoryId].count += 1;
                } else {
                  const value = `${connection.path}:${categoryId}`;
                  const label = taxonomy.categories[categoryId].attributes.title;
                  filterOptions.options[categoryId] = {
                    label,
                    showCount: true,
                    value,
                    count: 1,
                    query,
                    checked: optionChecked(locationQueryValue, value),
                    order: label,
                  };
                }
              }
            });
          }
        });
      });
    }
  }
  return filterOptions;
};
