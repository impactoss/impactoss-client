/*
 *
 * EntityList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import { updateQueryStringParams } from 'utils/history';
import { orderBy, find, map, forEach, reduce } from 'lodash/collection';
import { getEntitySortIteratee } from 'utils/sort';
import { fromJS } from 'immutable';

import Grid from 'grid-styled';

import EntityListFilters from 'components/EntityListFilters';

import PageHeader from 'components/PageHeader';
import EntityListItem from 'components/EntityListItem';
import Row from 'components/basic/Row';
import Container from 'components/basic/Container';

import { getEntities } from 'containers/App/selectors';

import {
  FORM_MODEL,
} from './constants';

import {
  activeFilterOptionSelector,
} from './selectors';

import {
  showFilterForm,
  hideFilterForm,
} from './actions';

export class EntityList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  getConnectedCategoryIds = (entity, connection, taxonomies) => {
    const connectionIds = map(map(Object.values(entity[connection.path]), 'attributes'), connection.key);
    return reduce(Object.values(taxonomies), (ids, taxonomy) => {
      const idsUpdated = ids;
      if (taxonomy.categories) {
        forEach(Object.values(taxonomy.categories), (category) => {
          if (category[connection.path]) {
            forEach(Object.values(category[connection.path]), (categoryAssociation) => {
              if (connectionIds.indexOf(categoryAssociation.attributes[connection.key]) > -1) {
                if (ids.indexOf(categoryAssociation.attributes.category_id) === -1) {
                  idsUpdated.push(categoryAssociation.attributes.category_id);
                }
              }
            });
          }
        });
      }
      return idsUpdated;
    }, []);
  }

  taxonomyFilterOptions = (entities) => {
    const { filters, taxonomies, activeFilterOption } = this.props;

    const filterOptions = {
      groupId: 'taxonomies',
      search: filters.taxonomies.search,
      options: {},
    };

    forEach(Object.values(entities), (entity) => {
      // if entity has taxonomies
      const taxonomyIds = []; // track taxonomies, so we can add without options for those not in here

      if (entity.taxonomies) {
        // add categories from entities if not present otherwise increase count
        const categoryIds = map(map(Object.values(entity.taxonomies), 'attributes'), 'category_id');
        forEach(categoryIds, (catId) => {
          // get taxonomy for each category
          const taxonomy = find(Object.values(taxonomies), (tax) =>
            tax.categories && Object.keys(tax.categories).indexOf(catId.toString()) > -1
          );
          if (taxonomy) {
            taxonomyIds.push(taxonomy.id); // tracking to identify missing taxonomies
            // if taxonomy active add filter option
            if (activeFilterOption.optionId === `taxonomies-${taxonomy.id}`) {
              filterOptions.title = filterOptions.title || taxonomy.attributes.title;
              // if category already added
              if (filterOptions.options[catId]) {
                filterOptions.options[catId].count += 1;
              } else {
                filterOptions.options[catId] = {
                  label: taxonomy.categories[catId].attributes.title,
                  value: catId,
                  count: 1,
                  query: filters.taxonomies.query,
                  // isSet: URLParams.has(location.query.cat) && URLParams.getAll(location.query.cat).indexOf(catId.toString()) > -1,
                };
              }
            }
          }
        });
      }
      // add without option for those taxonomies not associated with entity
      forEach(taxonomies, (taxonomy) => {
        if (activeFilterOption.optionId === `taxonomies-${taxonomy.id}` && taxonomyIds.indexOf(taxonomy.id) === -1) {
          if (filterOptions.options.without) {
            filterOptions.options.without.count += 1;
          } else {
            filterOptions.options.without = {
              label: `Without ${taxonomy.attributes.title}`,
              value: taxonomy.id,
              count: 1,
              query: 'without',
            };
          }
        }
      });
    });
    return filterOptions;
  }
  connectedTaxonomyFilterOptions = (entities) => {
    const { filters, connectedTaxonomies, activeFilterOption } = this.props;

    const filterOptions = {
      groupId: 'connectedTaxonomies',
      search: filters.connectedTaxonomies.search,
      options: {},
    };
    forEach(Object.values(entities), (entity) => {
      forEach(filters.connectedTaxonomies.connections, (connection) => {
        // if entity has taxonomies
        if (entity[connection.path]) { // recommendations stores recommendation_measures
          // add categories from entities if not present otherwise increase count
          const categoryIds = this.getConnectedCategoryIds(
            entity,
            connection,
            connectedTaxonomies.taxonomies
          );

          forEach(categoryIds, (catId) => {
            // TODO: the taxonomy lookup can may be omitted as we already iterate over taxonomies above
            const taxonomy = find(Object.values(connectedTaxonomies.taxonomies), (tax) =>
              tax.categories && Object.keys(tax.categories).indexOf(catId.toString()) > -1
            );
            if (taxonomy && activeFilterOption.optionId === `connectedTaxonomies-${taxonomy.id}`) {
              filterOptions.title = filterOptions.title || taxonomy.attributes.title;
              // if category already added
              if (filterOptions.options[catId]) {
                filterOptions.options[catId].count += 1;
              } else {
                filterOptions.options[catId] = {
                  label: taxonomy.categories[catId].attributes.title,
                  value: `${connection.path}:${catId}`,
                  count: 1,
                  query: filters.connectedTaxonomies.query,
                  // isSet: URLParams.has(location.query.catx) && URLParams.getAll(location.query.catx).indexOf(`${connection.path}:${catId}`) > -1,
                };
              }
            }
          });
        }
      });
    });
    return filterOptions;
  }

  connectionFilterOptions = (entities) => {
    const { filters, connections, activeFilterOption } = this.props;

    const filterOptions = {
      groupId: 'connections',
      options: {},
    };

    forEach(Object.values(entities), (entity) => {
      forEach(filters.connections.options, (option) => {
        // if option active
        if (activeFilterOption.optionId === `connections-${option.path}`) {
          filterOptions.title = filterOptions.title || option.label;
          filterOptions.search = filterOptions.search || option.search;
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
                  filterOptions.options[connectedId] = {
                    label: connection.attributes.title,
                    value: connectedId,
                    search: option.searchAttributes && option.searchAttributes.map((attribute) => connection.attributes[attribute]).join(),
                    count: 1,
                    query: option.query,
                    // isSet: URLParams.has(location.query[option.query]) && URLParams.getAll(location.query[option.query]).indexOf(connectedId.toString()) > -1,
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
              label: `Without ${option.label}`,
              value: option.query,
              count: 1,
              query: 'without',
            };
          }
        } // if (filterOptions.options.connections.options[option.path].show) {
      });
    });
    return filterOptions;
  }

  attributeFilterOptions = (entities) => {
    const { filters, activeFilterOption } = this.props;

    const filterOptions = {
      groupId: 'attributes',
      options: {},
    };

    forEach(Object.values(entities), (entity) => {
      forEach(filters.attributes.options, (option) => {
        if (activeFilterOption.optionId === `attributes-${option.attribute}`) {
          filterOptions.title = filterOptions.title || option.label;
          filterOptions.search = filterOptions.search || option.search;

          if (typeof entity.attributes[option.attribute] !== 'undefined') {
            // add connected entities if not present otherwise increase count
            const value = entity.attributes[option.attribute].toString();
            if (filterOptions.options[value]) {
              filterOptions.options[value].count += 1;
            } else {
              const attribute = find(option.options, (o) => o.value.toString() === value);
              filterOptions.options[value] = {
                label: attribute ? attribute.label : value,
                value: `${option.attribute}:${value}`,
                count: 1,
                query: 'where',
                // isSet: URLParams.has(location.query.where) && URLParams.getAll(location.query.where).indexOf(`${option.attribute}:${value}`) > -1,
              };
            }
          }
        }
      });
    });

    return filterOptions;
  }
  makeActiveFilterOptions = (entities) => {
    const { activeFilterOption } = this.props;
    // iterate through entities and create filterOptions
    // TODO refactor to function
    // if taxonomy options
    switch (activeFilterOption.group) {
      case 'taxonomies':
        return this.taxonomyFilterOptions(entities);
      case 'connectedTaxonomies':
        return this.connectedTaxonomyFilterOptions(entities);
      case 'connections':
        return this.connectionFilterOptions(entities);
      case 'attributes':
        return this.attributeFilterOptions(entities);
      default:
        return null;
    }
  }

  // figure out filter groups for filter panel
  makeFilterGroups = () => {
    const {
      filters,
      taxonomies,
      connections,
      connectedTaxonomies,
      activeFilterOption,
    } = this.props;

    const filterGroups = {};

    // taxonomy option group
    if (filters.taxonomies && taxonomies) {
      // first prepare taxonomy options
      filterGroups.taxonomies = {
        id: 'taxonomies', // filterGroupId
        label: filters.taxonomies.label,
        show: true,
        options: reduce(Object.values(taxonomies), (taxOptions, taxonomy) => ({
          ...taxOptions,
          [taxonomy.id]: {
            id: `taxonomies-${taxonomy.id}`, // filterOptionId
            label: taxonomy.attributes.title,
            active: !!activeFilterOption && activeFilterOption.optionId === `taxonomies-${taxonomy.id}`,
          },
        }), {}),
      };
    }

    // connectedTaxonomies option group
    if (filters.connectedTaxonomies && connectedTaxonomies.taxonomies) {
      // first prepare taxonomy options
      filterGroups.connectedTaxonomies = {
        id: 'connectedTaxonomies', // filterGroupId
        label: filters.connectedTaxonomies.label,
        show: true,
        options: reduce(Object.values(connectedTaxonomies.taxonomies), (taxOptions, taxonomy) => ({
          ...taxOptions,
          [taxonomy.id]: {
            id: `connectedTaxonomies-${taxonomy.id}`, // filterOptionId
            label: taxonomy.attributes.title,
            active: !!activeFilterOption && activeFilterOption.optionId === `connectedTaxonomies-${taxonomy.id}`,
          },
        }), {}),
      };
    }

    // connections option group
    if (filters.connections && connections) {
      // first prepare taxonomy options
      filterGroups.connections = {
        id: 'connections', // filterGroupId
        label: filters.connections.label,
        show: true,
        options: reduce(filters.connections.options, (options, option) => ({
          ...options,
          [option.path]: {
            id: `connections-${option.path}`, // filterOptionId
            label: option.label,
            active: !!activeFilterOption && activeFilterOption.optionId === `connections-${option.path}`,
          },
        }), {}),
      };
    }

    // attributes
    if (filters.attributes) {
      // first prepare taxonomy options
      filterGroups.attributes = {
        id: 'attributes', // filterGroupId
        label: filters.attributes.label,
        show: true,
        options: reduce(filters.attributes.options, (options, option) => ({
          ...options,
          [option.attribute]: {
            id: `attributes-${option.attribute}`, // filterOptionId
            label: option.label,
            active: !!activeFilterOption && activeFilterOption.optionId === `attributes-${option.attribute}`,
          },
        }), {}),
      };
    }
    // filterOptions = this.fillActiveFilterOptions(filterOptions, entities)

    return filterGroups;
  }

  render() {
    const { sortBy, sortOrder, activeFilterOption } = this.props;
    // sorted entities
    const entities = this.props.entities && orderBy(
      this.props.entities,
      getEntitySortIteratee(sortBy),
      sortOrder
    );
    // figure out filter panel options based on entities, taxononomies, connections, and connectedTaxonomies
    // const filterOptions = this.makeFilterOptions(filters, entities, taxonomies, connectedTaxonomies, connections, location);
    const filterGroups = this.makeFilterGroups();
    // get active filter options
    const formOptions = activeFilterOption ? this.makeActiveFilterOptions(entities) : null;
    // map entities to entity list item data
    const entitiesList = Object.values(entities).map(this.props.mapToEntityList);

    return (
      <Container>
        <Row>
          <Grid sm={1 / 4}>
            <EntityListFilters
              filterGroups={fromJS(filterGroups)}
              formOptions={fromJS(formOptions)}
              formModel={FORM_MODEL}
              onShowFilterForm={this.props.onShowFilterForm}
              onHideFilterForm={this.props.onHideFilterForm}
            />
          </Grid>
          <Grid sm={3 / 4}>
            <PageHeader title={this.props.header.title} actions={this.props.header.actions} />
            {entitiesList.map((entity, i) =>
              <EntityListItem key={i} {...entity} />
            )}
          </Grid>
        </Row>
      </Container>
    );
  }
}

EntityList.propTypes = {
  entities: PropTypes.object.isRequired,
  filters: PropTypes.object,
  taxonomies: PropTypes.object,
  connections: PropTypes.object,
  connectedTaxonomies: PropTypes.object,
  mapToEntityList: PropTypes.func.isRequired,
  //  location: PropTypes.object.isRequired, only needed in mapStateToProps
  // TODO: do not pass location directly but specific props, to allow multiple lists on same page
  header: PropTypes.object,
  sortBy: PropTypes.string,
  sortOrder: PropTypes.string,
  activeFilterOption: PropTypes.object,
  onShowFilterForm: PropTypes.func.isRequired,
  onHideFilterForm: PropTypes.func.isRequired,
};

EntityList.defaultProps = {
  sortBy: 'id',
  sortOrder: 'desc',
};

// attribute conditions
// query:"where=att1:value+att2:value"
const getAttributeQuery = (props) =>
  asArray(props.location.query.where).reduce((result, item) => {
    const r = result;
    const keyValue = item.split(':');
    r[keyValue[0]] = keyValue[1];
    return r;
  }, {});

const asArray = (v) => Array.isArray(v) ? v : [v];

// associative conditions
const getConnectedQuery = (props) => {
  const connected = [];
  forEach(props.location.query, (value, queryKey) => {
    // filter by associated category
    // "cat=1+2+3" catids regardless of taxonomy
    if (props.filters.taxonomies && queryKey === props.filters.taxonomies.query) {
      const condition = props.filters.taxonomies.connected;
      condition.where = asArray(value).map((catId) => ({
        [condition.whereKey]: catId,
      })); // eg { category_id: 3 }
      connected.push(condition);
    // filter by associated entity
    // "recommendations=1+2" recommendationids
    } else if (props.filters.connections && map(props.filters.connections.options, 'query').indexOf(queryKey) > -1) {
      const connectedEntity = find(
        props.filters.connections.options,
        { query: queryKey }
      );
      if (connectedEntity) {
        const condition = connectedEntity.connected;
        condition.where = asArray(value).map((connectionId) => ({
          [condition.whereKey]: connectionId,
        })); // eg { recommendation_id: 3 }
        connected.push(condition);
      }
    // filter by associated category of associated entity
    // query:"catx=recommendations:1" entitypath:catids regardless of taxonomy
    } else if (props.filters.connectedTaxonomies && queryKey === props.filters.connectedTaxonomies.query) {
      asArray(value).forEach((val) => {
        const pathValue = val.split(':');
        const connectedTaxonomy = find(
          props.filters.connectedTaxonomies.connections,
          (connection) => connection.path === pathValue[0]
        );
        // console.log(connection)
        if (connectedTaxonomy) {
          const condition = connectedTaxonomy.connected;
          condition.connected.where = {
            [condition.connected.whereKey]: pathValue[1],
          };
          connected.push(condition);
        }
      });
    }
  });
  return connected;
};

// absent taxonomy conditions
// query:"without=1+2+3+actions" either tax-id (numeric) or table path
const getWithoutQuery = (props) =>
  asArray(props.location.query.without).map((pathOrTax) => {
    // check numeric ? taxonomy filter : related entity filter
    if (!isNaN(parseFloat(pathOrTax)) && isFinite(pathOrTax)) {
      return {
        taxonomyId: pathOrTax,
        path: props.filters.taxonomies.connected.path,
        key: props.filters.taxonomies.connected.key,
      };
    }
    if (props.filters.connections.options) {
      // related entity filter
      const connection = find(props.filters.connections.options, { query: pathOrTax });
      return connection ? connection.connected : {};
    }
    return {};
  });

const mapStateToProps = (state, props) => ({
  activeFilterOption: activeFilterOptionSelector(state),
  entities: getEntities(state, {
    out: 'js',
    path: props.path,
    where: props.location.query && props.location.query.where ? getAttributeQuery(props) : null,
    connected: props.filters && props.location.query ? getConnectedQuery(props) : null,
    without: props.location.query && props.location.query.without ? getWithoutQuery(props) : null,
    extend: props.extensions,
  }),
  taxonomies: props.filters && props.filters.taxonomies
    ? getEntities(state, props.filters.taxonomies.select)
    : null,
  connections: props.filters && props.filters.connections
    ? reduce(props.filters.connections.options, (result, { path }) => ({
      ...result,
      [path]: getEntities(state, {
        out: 'js',
        path,
      }),
    }), {})
    : null,
  connectedTaxonomies: props.filters && props.filters.connectedTaxonomies
  ? reduce(props.filters.connectedTaxonomies.connections, (result, { select }) => ({
    ...result,
    [select.path]: getEntities(state, select),
  }), {})
  : null,
});

function mapDispatchToProps(dispatch) {
  return {
    onShowFilterForm: (activeFilterOption) => {
      dispatch(showFilterForm(activeFilterOption));
    },
    onHideFilterForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(hideFilterForm());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityList);
