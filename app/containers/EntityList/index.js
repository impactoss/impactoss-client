/*
 *
 * EntityQuery
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateQueryStringParams } from 'utils/history';
import { find, map, forEach } from 'lodash/collection';

import EntityListItem from 'components/EntityListItem';
import Container from 'components/basic/Container';


import {
  getEntitiesPaged,
} from 'containers/App/selectors';

export class EntityQuery extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  onSort = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    let sortOrder = this.props.location.query.sortOrder || this.props.sortOrder;
    const sortBy = this.props.location.query.sortBy || this.props.sortBy;
    if (evt.target.value === sortBy) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    updateQueryStringParams({ sortBy, sortOrder });
  }


  nextPage = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    const page = parseInt(this.props.location.query.page || 1, 10) + 1;
    updateQueryStringParams({ page });
  };

  prevPage = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    const page = parseInt(this.props.location.query.page || 1, 10) - 1;
    updateQueryStringParams({ page });
  };

  render() {
    const { entities, havePrevPage, haveNextPage } = this.props.pagedEntities;
    const sortOrder = this.props.location.query.sortOrder || this.props.sortOrder;
    const entitiesList = entities.map(this.props.mapToEntityList);

    return (
      <Container>
        <div>
          {this.onSort &&
            <button onClick={this.onSort} value="id">Sort ID {sortOrder === 'asc' ? 'desc' : 'asc'}</button>
          }
        </div>
        {entitiesList.map((entity, i) =>
          <EntityListItem key={i} {...entity} />
        )}
        {this.prevPage && havePrevPage &&
          <button onClick={this.prevPage}>Previous</button>
        }
        {this.nextPage && haveNextPage &&
          <button onClick={this.nextPage}>Next</button>
        }
      </Container>
    );
  }
}

EntityQuery.propTypes = {
  pagedEntities: PropTypes.shape({
    entities: PropTypes.array.isRequired,
    haveNextPage: PropTypes.boolean,
    havePrevPage: PropTypes.boolean,
  }).isRequired,
  mapToEntityList: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  // TODO: do not pass location directly but specific props, to allow multiple lists on same page
  sortBy: PropTypes.string,
  sortOrder: PropTypes.string,
  // path: PropTypes.string.isRequired,    only used in mapStateToProps
  // perPage: PropTypes.number,    only used in mapStateToProps
  // currentPage: PropTypes.number,    only used in mapStateToProps
};

EntityQuery.defaultProps = {
  perPage: 100,
  currentPage: 1,
  sortBy: 'id',
  sortOrder: 'desc',
};

// asssociative conditions
// query:"cat=1+2+3" catids regardless of taxonomy
const getRelatedQuery = (props) => {
  if (props.filters && props.location.query) {
    const join = [];
    forEach(props.location.query, (value, key) => {
      // category query
      if (key === props.filters.taxonomies.query.arg) {
        join.push({
          path: props.filters.taxonomies.query.path,
          key: props.filters.taxonomies.query.ownKey,
          where: value.split(' ').map((catId) => {
            const cond = {};
            cond[props.filters.taxonomies.query.key] = catId;
            return cond;
          }),
        });
      }
      if (map(props.filters.connections, 'query').indexOf(key) > -1) {
        const connection = find(props.filters.connections, { query: key });
        join.push({
          path: connection.join.path,
          key: connection.join.ownKey,
          where: value.split(' ').map((connectionId) => {
            const cond = {};
            cond[connection.join.key] = connectionId;
            return cond;
          }),
        });
      }
    });
    return join;
  }
  return null;
};

// absent taxonomy conditions
// query:"without=1+2+3+action" either tax-id (numeric) or table path
const getWithoutQuery = (props) => {
  if (props.location.query && props.location.query.without) {
    return props.location.query.without.split(' ').map((pathOrTax) => {
      // check numeric ? taxonomy filter : related entity filter
      if (!isNaN(parseFloat(pathOrTax)) && isFinite(pathOrTax)) {
        return {
          taxonomyId: pathOrTax,
          connectedPath: props.filters.taxonomies.query.path,
          key: props.filters.taxonomies.query.ownKey,
        };
      }
      // related entity filter
      const connection = find(props.filters.connections, { query: pathOrTax });
      return {
        connectedPath: connection.join.path,
        key: connection.join.ownKey,
      };
    });
  }
  return null;
};


// attribute conditions
// query:"where=att1:value+att2:value"
const getAttributeQuery = (props) => {
  if (props.location.query && props.location.query.where) {
    const where = props.location.query.where.split(' ').reduce((result, item) => {
      const r = result;
      const keyValue = item.split(':');
      r[keyValue[0]] = keyValue[1];
      return r;
    }, {});
    return where;
  }
  return null;
};

const mapStateToProps = (state, props) => {
  const { page, sortBy, sortOrder } = props.location.query;
  const currentPage = parseInt(page || 1, 10);

  return {
    pagedEntities: getEntitiesPaged(state, {
      path: props.path,
      join: getRelatedQuery(props),
      without: getWithoutQuery(props),
      where: getAttributeQuery(props),
      perPage: props.perPage || EntityQuery.defaultProps.perPage,
      currentPage: currentPage || EntityQuery.defaultProps.currentPage,
      sortBy: sortBy || EntityQuery.defaultProps.sortBy,
      sortOrder: sortOrder || EntityQuery.defaultProps.sortOrder,
    }),
  };
};


export default connect(mapStateToProps, null)(EntityQuery);
