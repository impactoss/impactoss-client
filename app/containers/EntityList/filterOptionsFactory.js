import { find, forEach, map } from 'lodash/collection';
import { upperFirst } from 'lodash/string';
import { lowerCase } from 'utils/string';
import { optionChecked, attributeOptionChecked } from './utils';

export const makeActiveFilterOptions = (entities, props, messages) => {
  // create filterOptions
  switch (props.activeFilterOption.group) {
    case 'taxonomies':
      return makeTaxonomyFilterOptions(entities, props, messages);
    case 'connectedTaxonomies':
      return makeConnectedTaxonomyFilterOptions(entities, props, messages);
    case 'connections':
      return makeConnectionFilterOptions(entities, props, messages);
    case 'attributes':
      return makeAttributeFilterOptions(entities, props, messages);
    default:
      return null;
  }
};

export const makeAttributeFilterOptions = (entities, { filters, activeFilterOption, location }, messages) => {
  const locationQuery = location.query;

  const filterOptions = {
    groupId: 'attributes',
    options: {},
  };
  // the attribute option
  const option = find(filters.attributes.options, (o) => o.attribute === activeFilterOption.optionId);
  if (option) {
    filterOptions.title = `${messages.titlePrefix} ${lowerCase(option.label)}`;
    // filterOptions.search = option.search;
    const locationQueryValue = locationQuery.where;
    if (entities.length === 0) {
      if (locationQueryValue && option.options) {
        forEach(Array.isArray(locationQueryValue) ? locationQueryValue : [locationQueryValue], (queryValue) => {
          if (attributeOptionChecked(queryValue, option.attribute)) {
            const locationQueryValueAttribute = queryValue.split(':');
            if (locationQueryValueAttribute.length > 1) {
              const locationAttribute = locationQueryValueAttribute[1];
              forEach(option.options, (attribute) => {
                if (attribute.value.toString() === locationAttribute) {
                  filterOptions.options[attribute.value] = {
                    label: {
                      main: attribute.label ? attribute.label : upperFirst(attribute.value),
                      count: true,
                    },
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
          if (option.extension && !!entity[option.extension.key]) {
            const extension = Object.values(entity[option.extension.key])[0];
            filterOptions.options[value] = {
              label: {
                main: extension ? extension.attributes[option.extension.label] : upperFirst(value),
                count: true,
              },
              value: queryValue,
              count: 1,
              query: 'where',
              checked: optionChecked(locationQueryValue, queryValue),
              order: extension ? extension.attributes[option.extension.label] : value,
            };
          } else if (filterOptions.options[value]) {
            filterOptions.options[value].count += 1;
          } else if (option.options) {
            const attribute = find(option.options, (o) => o.value.toString() === value);
            const label = attribute ? attribute.label : upperFirst(value);
            filterOptions.options[value] = {
              label: {
                main: label,
                count: true,
              },
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
              label: {
                main: `${messages.without} ${lowerCase(option.label)}`,
                count: true,
                bold: true,
              },
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
export const makeTaxonomyFilterOptions = (entities, { filters, taxonomies, activeFilterOption, location }, messages) => {
  const locationQuery = location.query;

  const filterOptions = {
    groupId: 'taxonomies',
    search: filters.taxonomies.search,
    options: {},
  };
  // get the active taxonomy
  const taxonomy = taxonomies[parseInt(activeFilterOption.optionId, 10)];
  if (taxonomy) {
    filterOptions.title = `${messages.titlePrefix} ${lowerCase(taxonomy.attributes.title)}`;
    if (entities.length === 0) {
      if (locationQuery[filters.taxonomies.query]) {
        const locationQueryValue = locationQuery[filters.taxonomies.query];
        forEach(Array.isArray(locationQueryValue) ? locationQueryValue : [locationQueryValue], (queryValue) => {
          const value = parseInt(queryValue, 10);
          if (taxonomy.categories[value]) {
            filterOptions.options[value] = {
              label: {
                main: taxonomy.categories[value].attributes.title || taxonomy.categories[value].attributes.name,
                count: true,
              },
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
        forEach(Array.isArray(locationQueryValue) ? locationQueryValue : [locationQueryValue], (queryValue) => {
          // numeric means taxonomy
          if (!isNaN(parseFloat(queryValue)) && isFinite(queryValue) && taxonomy.id === queryValue) {
            const value = parseInt(queryValue, 10);
            filterOptions.options[value] = {
              label: {
                main: `${messages.without} ${lowerCase(taxonomy.attributes.title)}`,
                count: true,
                bold: true,
              },
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
        // if entity has taxonomies
        if (entity.taxonomies) {
          // add categories from entities if not present otherwise increase count
          const categoryIds = map(map(Object.values(entity.taxonomies), 'attributes'), 'category_id');
          forEach(categoryIds, (catId) => {
            // if category is of current taxonomy
            if (taxonomy.categories && Object.keys(taxonomy.categories).indexOf(catId.toString()) > -1) {
              // if taxonomy active add filter option
              if (activeFilterOption.optionId === taxonomy.id.toString()) {
                filterOptions.title = filterOptions.title || taxonomy.attributes.title;
                // if category already added
                if (filterOptions.options[catId]) {
                  filterOptions.options[catId].count += 1;
                } else {
                  const label = taxonomy.categories[catId].attributes.title || taxonomy.categories[catId].attributes.name;
                  filterOptions.options[catId] = {
                    label: {
                      reference: null,
                      main: label,
                      count: true,
                    },
                    value: catId,
                    count: 1,
                    query: filters.taxonomies.query,
                    checked: optionChecked(locationQuery[filters.taxonomies.query], catId),
                    order: label,
                  };
                }
              }
            }
          });
        } else if (filterOptions.options.without) {
          filterOptions.options.without.count += 1;
        } else {
          filterOptions.options.without = {
            label: {
              main: `${messages.without} ${lowerCase(taxonomy.attributes.title)}`,
              count: true,
              bold: true,
            },
            value: taxonomy.id,
            count: 1,
            query: 'without',
            checked: optionChecked(locationQuery.without, taxonomy.id),
            order: 0,
          };
        }
      });  // for each entities
    }
  }
  return filterOptions;
};

//
//
//
export const makeConnectionFilterOptions = (entities, { filters, connections, activeFilterOption, location }, messages) => {
  const locationQuery = location.query;

  const filterOptions = {
    groupId: 'connections',
    options: {},
  };
  // get the active option
  const option = find(filters.connections.options, (o) => o.path === activeFilterOption.optionId);
  // if option active
  if (option) {
    filterOptions.title = `${messages.titlePrefix} ${lowerCase(option.label)}`;
    // if no entities found show any active options
    if (entities.length === 0) {
      if (locationQuery[option.query]) {
        const locationQueryValue = locationQuery[option.query];
        forEach(Array.isArray(locationQueryValue) ? locationQueryValue : [locationQueryValue], (queryValue) => {
          const value = parseInt(queryValue, 10);
          filterOptions.options[value] = {
            label: {
              main: connections[option.path] && connections[option.path][value]
                ? connections[option.path][value].attributes.title
                : upperFirst(value),
              count: true,
            },
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
        forEach(Array.isArray(locationQueryValue) ? locationQueryValue : [locationQueryValue], (queryValue) => {
          if (option.query === queryValue) {
            filterOptions.options[queryValue] = {
              label: {
                main: `${messages.without} ${lowerCase(option.label)}`,
                count: true,
                bold: true,
              },
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
              // if category already added
              if (filterOptions.options[connectedId]) {
                filterOptions.options[connectedId].count += 1;
              } else {
                const reference = connection.attributes.number || connection.id;
                filterOptions.options[connectedId] = {
                  label: {
                    reference,
                    main: connection.attributes.title || connection.attributes.friendly_name || connection.attributes.name,
                    count: true,
                  },
                  value: connectedId,
                  search: option.searchAttributes && option.searchAttributes.map((attribute) => connection.attributes[attribute]).join(),
                  count: 1,
                  query: option.query,
                  checked: optionChecked(locationQuery[option.query], connectedId),
                  order: reference,
                };
              }
            }
          });
        } else if (filterOptions.options.without) {
          // no connection present
          // add without option
          filterOptions.options.without.count += 1;
        } else {
          filterOptions.options.without = {
            label: {
              main: `${messages.without} ${lowerCase(option.label)}`,
              count: true,
              bold: true,
            },
            value: option.query,
            count: 1,
            query: 'without',
            checked: optionChecked(locationQuery.without, option.query),
            order: 0,
          };
        }
      });  // for each entities
    }
  }
  return filterOptions;
};

// get connected category ids for taxonomy
const getConnectedCategoryIds = (entity, connection, taxonomy) => {
  const categoryIds = [];
  if (taxonomy.categories) {
    // the associated entities ids, eg recommendation ids
    const connectionIds = map(map(Object.values(entity[connection.path]), 'attributes'), connection.key);
    // for each category of active taxonomy
    forEach(Object.values(taxonomy.categories), (category) => {
      // we have saved the associated entities, eg recommendations
      if (category[connection.path]) {
        // for each category-entitiy-connection, eg recommendation_categories
        forEach(Object.values(category[connection.path]), (categoryConnection) => {
          // if connection exists and category not previously recorded (through other connection)
          if (connectionIds.indexOf(categoryConnection.attributes[connection.key]) > -1
          && categoryIds.indexOf(categoryConnection.attributes.category_id) === -1) {
            // remember category
            categoryIds.push(categoryConnection.attributes.category_id);
          }
        });
      }
    });
  }
  return categoryIds;
};


export const makeConnectedTaxonomyFilterOptions = (entities, { filters, connectedTaxonomies, activeFilterOption, location }, messages) => {
  const locationQuery = location.query;

  const filterOptions = {
    groupId: 'connectedTaxonomies',
    search: filters.connectedTaxonomies.search,
    options: {},
  };

  const taxonomy = connectedTaxonomies.taxonomies[parseInt(activeFilterOption.optionId, 10)];
  if (taxonomy) {
    filterOptions.title = `${messages.titlePrefix} ${lowerCase(taxonomy.attributes.title)}`;
    const query = filters.connectedTaxonomies.query;
    const locationQueryValue = locationQuery[query];
    if (entities.length === 0) {
      if (locationQueryValue) {
        forEach(Array.isArray(locationQueryValue) ? locationQueryValue : [locationQueryValue], (queryValue) => {
          const locationQueryValueCategory = queryValue.split(':');
          if (locationQueryValueCategory.length > 1) {
            forEach(filters.connectedTaxonomies.connections, (connection) => {
              if (connection.path === locationQueryValueCategory[0]) {
                const categoryId = parseInt(locationQueryValueCategory[1], 10);
                if (taxonomy.categories[categoryId]) {
                  filterOptions.options[categoryId] = {
                    label: {
                      main: taxonomy.categories[categoryId].attributes.title,
                      count: true,
                    },
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
                    label: {
                      main: label,
                      count: true,
                    },
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
