/*
 *
 * EntityList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import { updateQueryStringParams } from 'utils/history';
import { orderBy, find, map, forEach } from 'lodash/collection';
import { getEntitySortIteratee } from 'utils/sort';

import Grid from 'grid-styled';

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
    const { sortBy, sortOrder } = this.props;
    const entities = this.props.entities && orderBy(
      this.props.entities,
      getEntitySortIteratee(sortBy),
      sortOrder
    );
    const entitiesList = Object.values(entities).map(this.props.mapToEntityList);

    return (
      <Container>
        <Row>
          <Grid sm={1 / 4}>
            Filters
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

// associative conditions
const getConnectedQuery = (props) => {
  const connected = [];
  forEach(props.location.query, (value, queryKey) => {
    // filter by associated category
    // "cat=1+2+3" catids regardless of taxonomy
    if (props.filters.taxonomies && queryKey === props.filters.taxonomies.query) {
      const condition = props.filters.taxonomies.connected;
      condition.where = value.split(' ').map((catId) => ({
        [condition.whereKey]: catId,
      })); // eg { category_id: 3 }
      connected.push(condition);
    }
    // filter by associated entity
    // "recommendations=1+2" recommendationids
    if (props.filters.connections && map(props.filters.connections, 'query').indexOf(queryKey) > -1) {
      const connectedEntity = find(
        props.filters.connections,
        { query: queryKey }
      );
      if (connectedEntity) {
        const condition = connectedEntity.connected;
        condition.where = value.split(' ').map((connectionId) => ({
          [condition.whereKey]: connectionId,
        })); // eg { recommendation_id: 3 }
        connected.push(condition);
      }
    }
    // filter by associated category of associated entity
    // query:"catx=recommendations:1" entitypath:catids regardless of taxonomy
    if (props.filters.connectedTaxonomies && queryKey === props.filters.connectedTaxonomies.query) {
      value.split(' ').forEach((val) => {
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
  props.location.query.without.split(' ').map((pathOrTax) => {
    // check numeric ? taxonomy filter : related entity filter
    if (!isNaN(parseFloat(pathOrTax)) && isFinite(pathOrTax)) {
      return {
        taxonomyId: pathOrTax,
        path: props.filters.taxonomies.connected.path,
        key: props.filters.taxonomies.connected.key,
      };
    }
    // related entity filter
    const connection = find(props.filters.connections, { query: pathOrTax });
    return connection ? connection.connected : {};
  });

const getExtensions = () => [];

const mapStateToProps = (state, props) => ({
  entities: getEntities(state, {
    out: 'js',
    path: props.path,
    where: props.location.query && props.location.query.where ? getAttributeQuery(props) : null,
    connected: props.filters && props.location.query ? getConnectedQuery(props) : null,
    without: props.location.query && props.location.query.without ? getWithoutQuery(props) : null,
    extend: getExtensions(props),
  }),
});


export default connect(mapStateToProps, null)(EntityList);
