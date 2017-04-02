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

import Grid from 'grid-styled';

import EntityListFilters from 'containers/EntityListFilters';

import PageHeader from 'components/PageHeader';
import EntityListItem from 'components/EntityListItem';
import Row from 'components/basic/Row';
import Container from 'components/basic/Container';

import { getEntities } from 'containers/App/selectors';

export class EntityList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  // onSort = (evt) => {
  //   if (evt !== undefined && evt.preventDefault) evt.preventDefault();
  //   let sortOrder = this.props.location.query.sortOrder || this.props.sortOrder;
  //   const sortBy = this.props.location.query.sortBy || this.props.sortBy;
  //   if (evt.target.value === sortBy) {
  //     sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  //   }
  //   updateQueryStringParams({ sortBy, sortOrder });
  // }
  //
  // nextPage = (evt) => {
  //   if (evt !== undefined && evt.preventDefault) evt.preventDefault();
  //   const page = parseInt(this.props.location.query.page || 1, 10) + 1;
  //   updateQueryStringParams({ page });
  // };
  //
  // prevPage = (evt) => {
  //   if (evt !== undefined && evt.preventDefault) evt.preventDefault();
  //   const page = parseInt(this.props.location.query.page || 1, 10) - 1;
  //   updateQueryStringParams({ page });
  // };

  render() {
    const {
      sortBy,
      sortOrder,
      location,
      filters,
      taxonomies,
      connections,
      connectedTaxonomies,
    } = this.props;

    const entities = this.props.entities && orderBy(
      this.props.entities,
      getEntitySortIteratee(sortBy),
      sortOrder
    );

    const URLParams = new URLSearchParams(location.search);

    // console.log(this.props)
    const entitiesList = Object.values(entities).map(this.props.mapToEntityList);

    // figure out filter panel options based on entities, taxononomies, connections, and connectedTaxonomies
    const filterOptions = {};
    // iterate through entities and create filterOptions
    // TODO refactor to function
    forEach(Object.values(entities), (entity) => {
      // taxonomies
      if (filters.taxonomies && taxonomies) {
        // first prepare taxonomy options
        if (!filterOptions.taxonomies) {
          filterOptions.taxonomies = {
            label: filters.taxonomies.label,
            options: reduce(Object.values(taxonomies), (taxOptions, taxonomy) => ({
              ...taxOptions,
              [taxonomy.id]: {
                label: taxonomy.attributes.title,
                options: {},
              },
            }), {}),
          };
        }
        if (entity.taxonomies) {
          const taxonomyIds = []; // track taxonomies, so we can add without options for those not in here
          // add categories from entities if not present otherwise increase count
          const categoryIds = map(map(Object.values(entity.taxonomies), 'attributes'), 'category_id');
          forEach(categoryIds, (catId) => {
            const taxonomy = find(Object.values(taxonomies), (tax) =>
              tax.categories && Object.keys(tax.categories).indexOf(catId.toString()) > -1
            );
            // if not taxonomy already considered
            if (taxonomy) {
              taxonomyIds.push(taxonomy.id);
              // if category already added
              if (filterOptions.taxonomies.options[taxonomy.id].options[catId]) {
                filterOptions.taxonomies.options[taxonomy.id].options[catId].count += 1;
              } else {
                filterOptions.taxonomies.options[taxonomy.id].options[catId] = {
                  label: taxonomy.categories[catId].attributes.title,
                  value: catId,
                  count: 1,
                  query: filters.taxonomies.query,
                //   isSet: !!(location.query.cat && location.query.cat.split(' ').indexOf(catId.toString()) > -1),
                  isSet: URLParams.has(location.query.cat) && URLParams.getAll(location.query.cat).indexOf(catId.toString()) > -1,
                };
              }
            }
          });
          // add without option
          forEach(taxonomies, (tax) => {
            if (taxonomyIds.indexOf(tax.id) === -1) {
              if (filterOptions.taxonomies.options[tax.id].options.without) {
                filterOptions.taxonomies.options[tax.id].options.without.count += 1;
              } else {
                filterOptions.taxonomies.options[tax.id].options.without = {
                  label: `Without ${tax.attributes.title}`,
                  value: tax.id,
                  count: 1,
                  query: 'without',
                };
              }
            }
          });
        } else {
          // without any taxonomies: add without for all taxonomies
          forEach(taxonomies, (tax) => {
            if (filterOptions.taxonomies.options[tax.id].options.without) {
              filterOptions.taxonomies.options[tax.id].options.without.count += 1;
            } else {
              filterOptions.taxonomies.options[tax.id].options.without = {
                label: `Without ${tax.attributes.title}`,
                value: tax.id,
                count: 1,
                query: 'without',
              };
            }
          });
        }
      }

      // connectedTaxonomies
      if (filters.connectedTaxonomies && connectedTaxonomies.taxonomies) {
        // first prepare taxonomy options
        if (!filterOptions.connectedTaxonomies) {
          filterOptions.connectedTaxonomies = {
            label: filters.connectedTaxonomies.label,
            expanded: false,
            options: reduce(Object.values(connectedTaxonomies.taxonomies), (taxOptions, taxonomy) => ({
              ...taxOptions,
              [taxonomy.id]: {
                label: taxonomy.attributes.title,
                options: {},
              },
            }), {}),
          };
        }
        forEach(filters.connectedTaxonomies.connections, (connection) => {
          if (entity[connection.path]) { // recommendations stores recommendation_measures
            // add categories from entities if not present otherwise increase count
            const connectedCategoryIds = reduce(Object.values(connectedTaxonomies.taxonomies), (ids, tax) => {
              const idsUpdated = ids;
              const recIds = map(map(Object.values(entity[connection.path]), 'attributes'), connection.key);
              // console.log('recIds', recIds);
              if (tax.categories && tax.categories) {
                forEach(Object.values(tax.categories), (cat) => {
                  if (cat[connection.path]) {
                    forEach(Object.values(cat[connection.path]), (categoryAssociation) => {
                      if (recIds.indexOf(categoryAssociation.attributes[connection.key]) > -1) {
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

            forEach(connectedCategoryIds, (catId) => {
              // TODO: the taxonomy lookup can may be omitted as we already iterate over taxonomies above
              const taxonomy = find(Object.values(connectedTaxonomies.taxonomies), (tax) =>
                tax.categories && Object.keys(tax.categories).indexOf(catId.toString()) > -1
              );
              if (taxonomy) {
                // if category already added
                if (filterOptions.connectedTaxonomies.options[taxonomy.id].options[catId]) {
                  filterOptions.connectedTaxonomies.options[taxonomy.id].options[catId].count += 1;
                } else {
                  filterOptions.connectedTaxonomies.options[taxonomy.id].options[catId] = {
                    label: taxonomy.categories[catId].attributes.title,
                    value: `${connection.path}:${catId}`,
                    count: 1,
                    query: filters.connectedTaxonomies.query,
                    isSet: URLParams.has(location.query.catx) && URLParams.getAll(location.query.catx).indexOf(`${connection.path}:${catId}`) > -1,
                  };
                }
              }
            });
          }
        });
      }

      // connections
      if (filters.connections && connections) {
        // first prepare taxonomy options
        if (!filterOptions.connections) {
          filterOptions.connections = {
            label: filters.connections.label,
            options: reduce(filters.connections.options, (options, option) => ({
              ...options,
              [option.path]: {
                label: option.label,
                options: {},
              },
            }), {}),
          };
        }

        forEach(filters.connections.options, (option) => {
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
                if (filterOptions.connections.options[option.path].options[connectedId]) {
                  filterOptions.connections.options[option.path].options[connectedId].count += 1;
                } else {
                  filterOptions.connections.options[option.path].options[connectedId] = {
                    label: connection.attributes.title,
                    value: connectedId,
                    count: 1,
                    query: option.path,
                    isSet: URLParams.has(location.query[option.path]) && URLParams.getAll(location.query[option.path]).indexOf(connectedId.toString()) > -1,
                  };
                }
              }
            });
          } else if (filterOptions.connections.options[option.path].options.without) {
            // no connection present
            // add without option
            filterOptions.connections.options[option.path].options.without.count += 1;
          } else {
            filterOptions.connections.options[option.path].options.without = {
              label: `Without ${option.label}`,
              value: option.path,
              count: 1,
              query: 'without',
            };
          }
        });
      }

      // attributes
      if (filters.attributes) {
        // first prepare taxonomy options
        if (!filterOptions.attributes) {
          filterOptions.attributes = {
            label: filters.attributes.label,
            options: reduce(filters.attributes.options, (options, option) => ({
              ...options,
              [option.attribute]: {
                label: option.label,
                options: {},
              },
            }), {}),
          };
        }
        forEach(filters.attributes.options, (attributeOption) => {
          if (typeof entity.attributes[attributeOption.attribute] !== 'undefined') {
            // add connected entities if not present otherwise increase count
            const value = entity.attributes[attributeOption.attribute].toString();
            if (filterOptions.attributes.options[attributeOption.attribute].options[value]) {
              filterOptions.attributes.options[attributeOption.attribute].options[value].count += 1;
            } else {
              const attribute = find(attributeOption.options, (option) => option.value.toString() === value);
              filterOptions.attributes.options[attributeOption.attribute].options[value] = {
                label: attribute ? attribute.label : value,
                value,
                count: 1,
                query: 'where',
                isSet: URLParams.has(location.query.where) && URLParams.getAll(location.query.where).indexOf(`${attributeOption.attribute}:${value}`) > -1,
              };
            }
          }
        });
      }
    });
    // console.log(filterOptions)

    return (
      <Container>
        <Row>
          <Grid sm={1 / 4}>
            <EntityListFilters
              filterOptions={filterOptions}
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
  location: PropTypes.object,
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
};

EntityList.defaultProps = {
  sortBy: 'id',
  sortOrder: 'desc',
};

// attribute conditions
// query:"where=att1:value+att2:value"
const getAttributeQuery = (props) =>
  props.location.query.where.split(' ').reduce((result, item) => {
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


export default connect(mapStateToProps, null)(EntityList);
