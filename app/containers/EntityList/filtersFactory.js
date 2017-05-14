import { find, forEach } from 'lodash/collection';
import { upperFirst } from 'lodash/string';

import { lowerCase } from 'utils/string';
import isNumber from 'utils/is-number';
import asArray from 'utils/as-array';


export const makeCurrentFilters = ({
  filters,
  taxonomies,
  connections,
  connectedTaxonomies,
  location,
  onTagClick,
},
withoutMessage
) => {
  const locationQuery = location.query;

  let filterTags = [];
  if (filters.taxonomies && taxonomies) {
    filterTags = filterTags.concat(getCurrentTaxonomyFilters(
      filters.taxonomies,
      taxonomies,
      locationQuery,
      onTagClick,
      withoutMessage
    ));
  }
  if (filters.connectedTaxonomies && connectedTaxonomies.taxonomies) {
    filterTags = filterTags.concat(getCurrentConnectedTaxonomyFilters(
      filters.connectedTaxonomies,
      connectedTaxonomies.taxonomies,
      locationQuery,
      onTagClick
    ));
  }
  if (filters.connections && connections) {
    filterTags = filterTags.concat(getCurrentConnectionFilters(
      filters.connections.options,
      connections,
      locationQuery,
      onTagClick,
      withoutMessage
    ));
  }
  if (filters.attributes) {
    filterTags = filterTags.concat(getCurrentAttributeFilters(
      filters.attributes.options,
      locationQuery,
      onTagClick
    ));
  }
  return filterTags;
};

export const getCurrentTaxonomyFilters = (taxonomyFilters, taxonomies, locationQuery, onClick, withoutMessage) => {
  const tags = [];
  if (locationQuery[taxonomyFilters.query]) {
    const locationQueryValue = locationQuery[taxonomyFilters.query];
    forEach(taxonomies, (taxonomy) => {
      forEach(asArray(locationQueryValue), (queryValue) => {
        const value = parseInt(queryValue, 10);
        if (taxonomy.categories[value]) {
          const category = taxonomy.categories[value];
          let label = (category.attributes.short_title && category.attributes.short_title.trim().length > 0
            ? category.attributes.short_title
            : category.attributes.title || category.attributes.name);
          label = label.length > 10 ? `${label.substring(0, 10)}...` : label;
          tags.push({
            label,
            type: 'taxonomies',
            id: taxonomy.id,
            onClick: () => onClick({
              value,
              query: taxonomyFilters.query,
              checked: false,
            }),
          });
        }
      });
    });
  }
  if (locationQuery.without) {
    const locationQueryValue = locationQuery.without;
    forEach(taxonomies, (taxonomy) => {
      forEach(asArray(locationQueryValue), (queryValue) => {
        // numeric means taxonomy
        if (isNumber(queryValue) && taxonomy.id === queryValue) {
          const value = parseInt(queryValue, 10);
          tags.push({
            label: `${withoutMessage} ${lowerCase(taxonomy.attributes.title)}`,
            type: 'taxonomies',
            id: taxonomy.id,
            without: true,
            onClick: () => onClick({
              value,
              query: 'without',
              checked: false,
            }),
          });
        }
      });
    });
  }
  return tags;
};
export const getCurrentConnectedTaxonomyFilters = (taxonomyFilters, connectedTaxonomies, locationQuery, onClick) => {
  const tags = [];
  if (locationQuery[taxonomyFilters.query]) {
    const locationQueryValue = locationQuery[taxonomyFilters.query];
    forEach(connectedTaxonomies, (taxonomy) => {
      forEach(asArray(locationQueryValue), (queryValue) => {
        const valueSplit = queryValue.split(':');
        if (valueSplit.length > 0) {
          const value = parseInt(valueSplit[1], 10);
          if (taxonomy.categories[value]) {
            const category = taxonomy.categories[value];
            let label = (category.attributes.short_title && category.attributes.short_title.trim().length > 0
              ? category.attributes.short_title
              : category.attributes.title || category.attributes.name);
            label = label.length > 10 ? `${label.substring(0, 10)}...` : label;
            tags.push({
              label,
              type: 'taxonomies',
              id: taxonomy.id,
              onClick: () => onClick({
                value: queryValue,
                query: taxonomyFilters.query,
                checked: false,
              }),
            });
          }
        }
      });
    });
  }
  return tags;
};
export const getCurrentConnectionFilters = (connectionFiltersOptions, connections, locationQuery, onClick, withoutMessage) => {
  const tags = [];
  forEach(connectionFiltersOptions, (option) => {
    if (locationQuery[option.query] && connections[option.path]) {
      const locationQueryValue = locationQuery[option.query];
      forEach(asArray(locationQueryValue), (queryValue) => {
        const value = parseInt(queryValue, 10);
        const connection = connections[option.path][value];
        let label = connection
            ? connection.attributes.title || connection.attributes.friendly_name || connection.attributes.name
            : upperFirst(value);
        label = label.length > 20 ? `${label.substring(0, 20)}...` : label;
        tags.push({
          label,
          type: option.path === 'measures' ? 'actions' : option.path,
          onClick: () => onClick({
            value,
            query: option.query,
            checked: false,
          }),
        });
      });
    }
  });

  if (locationQuery.without) {
    const locationQueryValue = locationQuery.without;
    forEach(connectionFiltersOptions, (option) => {
      forEach(asArray(locationQueryValue), (queryValue) => {
        // numeric means taxonomy
        if (option.query === queryValue) {
          tags.push({
            label: `${withoutMessage} ${lowerCase(option.label)}`,
            type: option.path === 'measures' ? 'actions' : option.path,
            without: true,
            onClick: () => onClick({
              value: queryValue,
              query: 'without',
              checked: false,
            }),
          });
        }
      });
    });
  }
  return tags;
};
export const getCurrentAttributeFilters = (attributeFiltersOptions, locationQuery, onClick) => {
  const tags = [];
  if (locationQuery.where) {
    const locationQueryValue = locationQuery.where;
    forEach(attributeFiltersOptions, (option) => {
      if (locationQueryValue) {
        forEach(asArray(locationQueryValue), (queryValue) => {
          const valueSplit = queryValue.split(':');
          if (valueSplit[0] === option.attribute && valueSplit.length > 0) {
            const value = valueSplit[1];
            if (option.extension) {
              // TODO: show display value not query queryValue
              tags.push({
                label: `${option.label}:${value}`,
                type: 'attributes',
                onClick: () => onClick({
                  value: queryValue,
                  query: 'where',
                  checked: false,
                }),
              });
            } else if (option.options) {
              const attribute = find(option.options, (o) => o.value.toString() === value);
              let label = attribute ? attribute.label : upperFirst(value);
              label = label.length > 10 ? `${label.substring(0, 10)}...` : label;
              tags.push({
                label,
                type: 'attributes',
                onClick: () => onClick({
                  value: queryValue,
                  query: 'where',
                  checked: false,
                }),
              });
            }
          }
        });
      }
    });
  }
  return tags;
};
