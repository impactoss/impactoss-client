/*
 *
 * EntityQuery
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateQueryStringParams } from 'utils/history';

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

const mapStateToProps = (state, props) => {
  const { page, sortBy, sortOrder } = props.location.query;
  const currentPage = parseInt(page || 1, 10);

  // asssociative conditions
  // query:"cat=id1+id2+id3"
  const join = [];
  if (props.filters && props.location.query && props.location.query.cat) {
    join.push({
      key: props.filters.categoryKey,
      path: props.filters.categoriesPath,
      where: props.location.query.cat.split(' ').map((catId) => ({ category_id: catId })),
    });
  }
  // attribute conditions
  // where:"where=att1:value+att2:value"
  let where;
  if (props.location.query && props.location.query.where) {
    where = props.location.query.where.split(' ').reduce((result, item) => {
      const r = result;
      const keyValue = item.split(':');
      r[keyValue[0]] = keyValue[1];
      return r;
    }, {});
  }
  return {
    pagedEntities: getEntitiesPaged(state, {
      path: props.path,
      join,
      where,
      perPage: props.perPage || EntityQuery.defaultProps.perPage,
      currentPage: currentPage || EntityQuery.defaultProps.currentPage,
      sortBy: sortBy || EntityQuery.defaultProps.sortBy,
      sortOrder: sortOrder || EntityQuery.defaultProps.sortOrder,
    }),
  };
};


export default connect(mapStateToProps, null)(EntityQuery);
