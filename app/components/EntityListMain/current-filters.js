import { find, forEach } from 'lodash/collection';
import { upperFirst } from 'lodash/string';

import { TEXT_TRUNCATE } from 'themes/config';

import { getCategoryShortTitle } from 'utils/entities';
import { qe } from 'utils/quasi-equals';

import { truncateText } from 'utils/string';
import isNumber from 'utils/is-number';
import asList from 'utils/as-list';


export const currentFilterArgs = (config, locationQuery) => {
  let args = [];
  if (config.frameworks && locationQuery.get(config.frameworks.query)) {
    args = args.concat(config.frameworks.query);
  }
  if (config.taxonomies && locationQuery.get(config.taxonomies.query)) {
    args = args.concat(config.taxonomies.query);
  }
  if (config.connectedTaxonomies && locationQuery.get(config.connectedTaxonomies.query)) {
    args = args.concat(config.connectedTaxonomies.query);
  }
  if (config.connections && locationQuery.get(config.connections.query)) {
    args = args.concat(config.connections.query);
  }
  if (locationQuery.get('where')) {
    args = args.concat('where');
  }
  if (locationQuery.get('without')) {
    args = args.concat('without');
  }
  if (locationQuery.get('search')) {
    args = args.concat('search');
  }
  return args;
};


export const currentFilters = (
  {
    config,
    entities,
    taxonomies,
    connections,
    locationQuery,
    onTagClick,
    errors,
    frameworks,
  },
  withoutLabel,
  errorLabel,
) => {
  let filterTags = [];
  if (errors && errors.size > 0) {
    filterTags.push(getErrorTag(errorLabel));
  }
  if (config.frameworks && frameworks && frameworks.size > 1) {
    filterTags = filterTags.concat(getCurrentFrameworkFilter(
      config.frameworks,
      frameworks,
      locationQuery,
      onTagClick
    ));
  }
  if (config.taxonomies && taxonomies) {
    filterTags = filterTags.concat(getCurrentTaxonomyFilters(
      config.taxonomies,
      taxonomies,
      locationQuery,
      onTagClick,
      withoutLabel
    ));
  }
  if (config.connectedTaxonomies && taxonomies) {
    filterTags = filterTags.concat(getCurrentConnectedTaxonomyFilters(
      config.connectedTaxonomies,
      taxonomies,
      locationQuery,
      onTagClick
    ));
  }
  if (config.connections && connections) {
    filterTags = filterTags.concat(getCurrentConnectionFilters(
      config.connections,
      connections,
      locationQuery,
      onTagClick,
      withoutLabel
    ));
  }
  if (config.attributes) {
    filterTags = filterTags.concat(getCurrentAttributeFilters(
      entities,
      config.attributes.options,
      locationQuery,
      onTagClick,
      withoutLabel
    ));
  }
  return filterTags;
};

const getErrorTag = (label) => ({
  id: 'error',
  type: 'error',
  label,
});
const getConnectionLabel = (connection, value) => {
  const label = connection
    ? connection.getIn(['attributes', 'reference']) || connection.get('id')
    : upperFirst(value);
  return truncateText(label, TEXT_TRUNCATE.CONNECTION_TAG);
};
const getCategoryLabel = (category) => truncateText(getCategoryShortTitle(category), TEXT_TRUNCATE.ENTITY_TAG);

const getCurrentTaxonomyFilters = (
  taxonomyFilters,
  taxonomies,
  locationQuery,
  onClick,
  withoutLabel
) => {
  const tags = [];
  if (locationQuery.get(taxonomyFilters.query)) {
    const locationQueryValue = locationQuery.get(taxonomyFilters.query);
    taxonomies.forEach(
      (taxonomy) => {
        asList(locationQueryValue).forEach((queryValue) => {
          const value = queryValue.toString();
          if (taxonomy.getIn(['categories', value])) {
            const category = taxonomy.getIn(['categories', value]);
            tags.push({
              label: getCategoryLabel(category),
              type: 'taxonomies',
              id: taxonomy.get('id'),
              inverse: category.getIn(['attributes', 'draft']),
              onClick: () => onClick({
                value,
                query: taxonomyFilters.query,
                checked: false,
              }),
            });
          }
        });
      }
    );
  }
  if (locationQuery.get('without')) {
    const locationQueryValue = locationQuery.get('without');
    taxonomies.forEach((taxonomy) => {
      asList(locationQueryValue).forEach((queryValue) => {
        // numeric means taxonomy
        if (isNumber(queryValue) && taxonomy.get('id') === queryValue) {
          const value = queryValue.toString();
          tags.push({
            labels: [
              { label: withoutLabel },
              {
                label: `entities.taxonomies.${parseInt(taxonomy.get('id'), 10)}.single`,
                lowerCase: true,
                appMessage: true,
              },
            ],
            type: 'taxonomies',
            id: taxonomy.get('id'),
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

const getCurrentFrameworkFilter = (
  config,
  frameworks,
  locationQuery,
  onClick,
) => {
  const tags = [];
  if (locationQuery.get(config.query)) {
    const locationQueryValue = locationQuery.get(config.query);
    const framework = frameworks.find((fw) => qe(fw.get('id'), locationQueryValue));
    if (framework) {
      tags.push({
        message: `frameworks_short.${framework.get('id')}`,
        type: 'recommendations',
        id: 0,
        onClick: () => onClick({
          value: framework.get('id'),
          query: config.query,
          checked: false,
        }),
      });
    }
  }
  return tags;
};


const getCurrentConnectedTaxonomyFilters = (
  taxonomyFilters,
  taxonomies,
  locationQuery,
  onClick
) => {
  const tags = [];
  if (locationQuery.get(taxonomyFilters.query)) {
    const locationQueryValue = locationQuery.get(taxonomyFilters.query);
    taxonomies.forEach((taxonomy) => {
      asList(locationQueryValue).forEach((queryValue) => {
        const valueSplit = queryValue.split(':');
        if (valueSplit.length > 0) {
          const value = valueSplit[1].toString();
          if (taxonomy.getIn(['categories', value])) {
            const category = taxonomy.getIn(['categories', value]);
            tags.push({
              label: getCategoryLabel(category),
              type: 'taxonomies',
              id: taxonomy.get('id'),
              inverse: category.getIn(['attributes', 'draft']),
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
const getCurrentConnectionFilters = (
  connectionFilters,
  connections,
  locationQuery,
  onClick,
  withoutLabel
) => {
  const tags = [];
  forEach(connectionFilters.options, (option) => {
    if (locationQuery.get(connectionFilters.query) && connections.get(option.path)) {
      const locationQueryValue = locationQuery.get(connectionFilters.query);
      asList(locationQueryValue).forEach((queryValue) => {
        const valueSplit = queryValue.split(':');
        if (valueSplit.length > 0) {
          if (option.path === valueSplit[0].split('_')[0]) {
            const value = valueSplit[1].toString();
            const connection = connections.getIn([option.path, value]);
            if (connection) {
              tags.push({
                label: getConnectionLabel(connection, value),
                type: option.path,
                inverse: connection.getIn(['attributes', 'draft']),
                onClick: () => onClick({
                  value: queryValue,
                  query: connectionFilters.query,
                  checked: false,
                }),
              });
            }
          }
        }
      });
    }
  });

  if (locationQuery.get('without')) {
    const locationQueryValue = locationQuery.get('without');
    forEach(connectionFilters.options, (option) => {
      asList(locationQueryValue).forEach((queryValue) => {
        const valueFw = queryValue.split('_');
        const fwid = valueFw.length > 1 && valueFw[1];
        // numeric means taxonomy
        if (option.path === valueFw[0]) {
          tags.push({
            labels: [
              { label: withoutLabel },
              {
                appMessage: true,
                label: (
                  option.groupByFramework
                  && option.message
                  && option.message.indexOf('{fwid}') > -1
                )
                  ? option.message.replace('{fwid}', fwid)
                  : option.message,
                lowerCase: true,
              },
              { label: option.label },
            ],
            type: option.path,
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
const getCurrentAttributeFilters = (entities, attributeFiltersOptions, locationQuery, onClick, withoutLabel) => {
  const tags = [];
  if (locationQuery.get('where')) {
    const locationQueryValue = locationQuery.get('where');
    forEach(attributeFiltersOptions, (option) => {
      if (locationQueryValue) {
        asList(locationQueryValue).forEach((queryValue) => {
          const valueSplit = queryValue.split(':');
          if (valueSplit[0] === option.attribute && valueSplit.length > 0) {
            const value = valueSplit[1];
            if (option.reference) {
              // without
              if (value === 'null') {
                tags.push({
                  labels: [
                    { label: withoutLabel },
                    { appMessage: !!option.message, label: option.message || option.label, lowerCase: true },
                  ],
                  type: 'attributes',
                  onClick: () => onClick({
                    value: queryValue,
                    query: 'where',
                    checked: false,
                  }),
                });
              } else {
                const referenceEntity = entities.find((entity) => qe(entity.getIn(['attributes', option.attribute]), value));
                const label = referenceEntity && referenceEntity.getIn([option.reference.key, 'attributes', option.reference.label]);
                tags.push({
                  labels: label
                    ? [{ label }]
                    : [
                      { appMessage: !!option.message, label: option.message || option.label, postfix: ':' },
                      { label: value },
                    ],
                  type: 'attributes',
                  onClick: () => onClick({
                    value: queryValue,
                    query: 'where',
                    checked: false,
                  }),
                });
              }
            } else if (option.options) {
              const attribute = find(option.options, (o) => o.value.toString() === value.toString());
              let label = attribute ? attribute.message : upperFirst(value);
              label = truncateText(label, TEXT_TRUNCATE.ATTRIBUTE_TAG);
              tags.push({
                labels: [{
                  appMessage: !!attribute.message,
                  label,
                }],
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
